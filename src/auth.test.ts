import { describe, it, expect, beforeAll, } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, extractToken } from "./api/auth.js";
import { UnauthorizedError, BadRequestError } from "./api/errors.js";

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

describe("Verify Bearer token string", () => {
  const token = "TOKEN";
  const validString = `Bearer ${token}`;
  const notBearer = `${token}`;
  const splittedToken = `${token} Bearer`;
  const otherNotBearer = `Barrrr ${token}`;

  it("Should throw error if token is undefined", () => {
    expect(() => extractToken(undefined, "Bearer")).toThrow(BadRequestError);
  });

  it("the string is valid", () => {
    const validToken  = extractToken(validString, "Bearer");
    expect(validToken).toBe(token);
  });

  it("Should throw error if the string have not the word 'Bearer'", () => {
    expect(() => extractToken(notBearer, "Bearer")).toThrow(BadRequestError);
  });

  it("Should throw error if the string have the token before Bearer", () => {
    expect(() => extractToken(splittedToken, "Bearer")).toThrow(BadRequestError);
  });

  it("Should throw error if the string have the word Barrrr", () => {
    expect(() => extractToken(otherNotBearer, "Bearer")).toThrow(BadRequestError);
  });

});

describe("Verify ApiKey token string", () => {
  const token = "TOKEN";
  const validString = `ApiKey ${token}`;
  const notBearer = `${token}`;
  const splittedToken = `${token} ApiKey`;
  const otherNotBearer = `apikey ${token}`;

  it("Should throw error if token is undefined", () => {
    expect(() => extractToken(undefined, "Bearer")).toThrow(BadRequestError);
  });

  it("the string is valid", () => {
    const validToken  = extractToken(validString, "ApiKey");
    expect(validToken).toBe(token);
  });

  it("Should throw error if the string have not the word 'ApiKey'", () => {
    expect(() => extractToken(notBearer, "ApiKey")).toThrow(BadRequestError);
  });

  it("Should throw error if the string have the token before ApiKey", () => {
    expect(() => extractToken(splittedToken, "ApiKey")).toThrow(BadRequestError);
  });

  it("Should throw error if the string have the word apikey", () => {
    expect(() => extractToken(otherNotBearer, "ApiKey")).toThrow(BadRequestError);
  });

});
