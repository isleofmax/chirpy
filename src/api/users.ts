import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";
import type { NewUser } from "../db/schema.js";

export async function users(req: Request, res: Response) {
  type Parameters = {
    email: string;
  }
  const body: Parameters = await req.body;
  if (!body.email) {
    throw new BadRequestError("Bad Request: invalid parameters");
  }

  const newUser: NewUser = { email: body.email };
  const user = await createUser(newUser);

  res.header("Content-Type", "application/json");
  res.status(201).send(JSON.stringify(user));
}
