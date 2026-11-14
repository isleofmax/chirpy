import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./api/auth.js";
import { UnauthorizedError } from "./api/errors.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const result = await checkPasswordHash(password2, hash1);
    expect(result).toBe(false);
  });

  it("should return false for empty password", async () => {
    const result = await checkPasswordHash(password2, hash1);
    expect(result).toBe(false);
  });
});

describe("JWT sign and verify", () => {
  const secret = "1234567890";
  const wrongSecret = "0987654321";
  const userId = "user123";
  const expiresIn = 60000;
  let validToken: string;

  beforeAll(async () => {
    validToken = makeJWT(userId, expiresIn, secret);
  });

  it("should return the token", () => {
    expect(validToken.length).not.equal(0);
  });

  it("userId must be valid", () => {
    const validUserId  = validateJWT(validToken, secret);
    console.log(validUserId);
    expect(userId).toBe(validUserId);
  });

  it("error in validation for invalid secret", () => {
    expect(() => validateJWT(validToken, wrongSecret)).toThrow(UnauthorizedError);
  });

  it("error in validation for invalid token", () => {
    expect(() => validateJWT("invalidtoken", secret)).toThrow(UnauthorizedError);
  });
});

