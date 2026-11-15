import { Request, Response } from "express";
import { UnauthorizedError, BadRequestError } from "./errors.js";
import { hashPassword, checkPasswordHash, makeJWT } from "./auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import type { NewUser } from "../db/schema.js";

export async function login(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
    expiresInSeconds?: number;
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

  let expiresIn = 3600;
  if (body.expiresInSeconds !== undefined) {
    if (body.expiresInSeconds < expiresIn) {
      expiresIn = body.expiresInSeconds;
    }
  }
  const token = makeJWT(user.id, expiresIn, config.apiConfig.secret);
  
  const response = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token
  };

  res.header("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(response));
}
