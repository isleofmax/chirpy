import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError, BadRequestError } from "./errors.js";
import { Request } from "express";
import crypto from "crypto";

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

export function extractToken(authorization: string | undefined, type: string): string {
  if (authorization === undefined) {
    throw new BadRequestError("Authorization string not found");
  }
  const words = authorization.split(" ");
  let foundToken = false;

  for (let word of words) {
    if (foundToken === false) {
      if (word.length !== 0 && word === type) {
        foundToken = true;
      }
    } else {
      if (word.length !== 0) {
        return word;
      }
    }
  }

  throw new BadRequestError("Authorization string not found");
}

export function getBearerToken(req: Request): string {
  const bearer = req.get("Authorization");
  if (!bearer) {
    throw new UnauthorizedError("Unauthorized");
  }
  const token = extractToken(bearer, "Bearer");
  return token;
}

export function makeRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getAPIKey(req: Request): string {
  const apiKey = req.get("Authorization");
  if (!apiKey) {
    throw new UnauthorizedError("Unauthorized");
  }
  const token = extractToken(apiKey, "ApiKey");
  return token;
}
