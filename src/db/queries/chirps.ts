import { db } from "../index.js";
import { eq, and, desc } from "drizzle-orm";
import { type NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
  return result;
}

export async function chirpsOrderByCreation(authorId?: string, sort?: string) {
  let result = undefined;
  if (!sort || sort === "asc") {
    result = await db.select().from(chirps).where(authorId ? eq(chirps.userId, authorId) : undefined).orderBy(chirps.createdAt);
  } else {
    result = await db.select().from(chirps).where(authorId ? eq(chirps.userId, authorId) : undefined).orderBy(desc(chirps.createdAt));
  }
  return result;
}

export async function chirpById(chirpId: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  return result;
}

export async function deleteChirpById(chirpId: string, userId: string) {
  const [result] = await db.delete(chirps).where(and(eq(chirps.id, chirpId), eq(chirps.userId, userId)));
  return result;
}
