import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./errors.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashed = await argon2.hash(password);
    return hashed;
  } catch(err) {
    throw new Error("Error hashing password");
  }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  try {
    const found = await argon2.verify(hash, password);
    return found;
  } catch(err) {
    throw new Error("Error verifying password");
  }
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;
  const payloadObj = { iss: "chirpy", sub: userID, iat: iat, exp: exp} satisfies payload;

  const jwtString = jwt.sign(payloadObj, secret);
  return jwtString;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const payloadObj = jwt.verify(tokenString, secret) as JwtPayload;
    if (payloadObj.iss !== "chirpy") {
      throw new UnauthorizedError("Invalid issuer");
    }

    if (!payloadObj.sub) {
      throw new UnauthorizedError("No user ID in token");
    }

    return payloadObj.sub;
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
}
