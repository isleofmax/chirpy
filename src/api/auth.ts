import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

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
  type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
  return "";
}

export function validateJWT(tokenString: string, secret: string): string {
  return "";
}
