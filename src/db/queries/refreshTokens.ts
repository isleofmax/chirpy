import { db } from "../index.js";
import { eq } from 'drizzle-orm';
import { type NewRefreshToken, refreshToken } from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken) {
  const [result] = await db.insert(refreshToken).values(token).returning();
  return result;
}

export async function userForRefreshToken(token: string) {
  const [result] = await db.select().from(refreshToken).where(eq(refreshToken.token, token));
  return result;
}

export async function revokeRefreshToken(token: string) {
  const now = new Date();
  const [result] = await db.update(refreshToken).set({ revokedAt: now }).where(eq(refreshToken.token, token)).returning();
  return result;
}
