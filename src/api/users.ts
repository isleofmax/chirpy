import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import type { NewUser } from "../db/schema.js";

export async function users(req: Request, res: Response) {
  const body = await req.body;
  const newUser: NewUser = { email: body.email };
  const user = await createUser(newUser);

  res.header("Content-Type", "application/json");
  res.status(201).send(JSON.stringify(user));
}
