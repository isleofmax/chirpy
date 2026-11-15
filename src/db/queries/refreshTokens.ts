import { db } from "../index.js";
import { eq } from 'drizzle-orm';
import { type NewRefreshToken, refreshToken } from "../schema.js";

export async function createRefreshToken(refresh: NewRefreshToken) {
  const [result] = await db.insert(refreshToken).values(refresh).returning();
  return result;
}
