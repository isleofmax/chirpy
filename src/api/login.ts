import { Request, Response } from "express";
import { UnauthorizedError, BadRequestError } from "./errors.js";
import { hashPassword, checkPasswordHash } from "./auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import type { NewUser, UserResponse } from "../db/schema.js";

export async function login(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
  }

  const body: Parameters = await req.body;
  if (!body.email || !body.password) {
    throw new BadRequestError("Bad Request: invalid parameters");
  }

  const user = await getUserByEmail(body.email);
  if (!user) {
    throw new UnauthorizedError("incorrect email or password");
  }

  try {
    const foundPassword = await checkPasswordHash(body.password, user.hashedPassword);
    if (!foundPassword) {
      throw new UnauthorizedError("incorrect email or password");
    }
  } catch (err) {
    throw new UnauthorizedError("incorrect email or password");
  }
  
  const userResponse: UserResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  };

  res.header("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(userResponse));
}
