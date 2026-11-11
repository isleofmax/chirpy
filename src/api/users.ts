import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "./auth.js";
import { createUser } from "../db/queries/users.js";
import type { NewUser, UserResponse } from "../db/schema.js";

export async function users(req: Request, res: Response) {
  type Parameters = {
    password: string;
    email: string;
  }

  const body: Parameters = await req.body;
  if (!body.email || !body.password) {
    throw new BadRequestError("Bad Request: invalid parameters");
  }

  const password = await hashPassword(body.password);
  const newUser: NewUser = { email: body.email, hashedPassword: password };

  const user = await createUser(newUser);
  if (!user) {
    throw new Error("Cannot insert new user");
  }

  const userResponse: UserResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  };

  res.header("Content-Type", "application/json");
  res.status(201).send(JSON.stringify(userResponse));
}
