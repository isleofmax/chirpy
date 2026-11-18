import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { hashPassword, getBearerToken, validateJWT } from "./auth.js";
import { createUser, getUserById, updateUsers } from "../db/queries/users.js";
import { config } from "../config.js";
import type { NewUser, UserResponse } from "../db/schema.js";

export async function users(req: Request, res: Response) {
  type Parameters = {
    password: string;
    email: string;
  }

  const body: Parameters = req.body;
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
    isChirpyRed: user.isChirpyRed,
  };

  res.header("Content-Type", "application/json");
  res.status(201).send(JSON.stringify(userResponse));
}

export async function updateUser(req: Request, res: Response) {
  type Parameters = {
    password: string;
    email: string;
  }

  const body: Parameters = req.body;
  if (!body.email || !body.password) {
    throw new BadRequestError("Bad Request: invalid parameters");
  }

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.apiConfig.secret);
  const user = await getUserById(userId);
  if (!user) {
    throw new UnauthorizedError("Unauthorized: invalid token");
  }

  const password = await hashPassword(body.password);

  const updatedUser = await updateUsers(user.id, body.email, password);
  const userResponse: UserResponse = {
    id: updatedUser.id,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
    email: updatedUser.email,
    isChirpyRed: updatedUser.isChirpyRed,
  };

  res.header("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(userResponse));
}
