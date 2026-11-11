import { hash, verify } from "argon2";

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashed = await hash(password);
    return hashed;
  } catch(err) {
    throw new Error("Error hashing password");
  }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  try {
    const found = await verify(hash, password);
    return found;
  } catch(err) {
    throw new Error("Error verifying password");
  }
}
