import { db } from "../index.js";
import { eq } from 'drizzle-orm';
import { type NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserById(id: string) {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function updateUsers(userId: string, email: string, password: string, ) {
  const [result] = await db.update(users).set({ email: email, hashedPassword: password }).where(eq(users.id, userId)).returning();
  return result;
}
