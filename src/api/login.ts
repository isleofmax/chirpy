import { Request, Response } from "express";
import { UnauthorizedError, BadRequestError } from "./errors.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
import { config } from "../config.js";
import { type NewRefreshToken } from "../db/schema.js";

export async function login(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
  }

  const body: Parameters = req.body;
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

  const token = makeJWT(user.id, 3600, config.apiConfig.secret);
  const refreshToken = makeRefreshToken();
  const newRefreshToken: NewRefreshToken = {
    token: refreshToken,
    expiresAt: new Date(Date.now() + 5184000000),
    revokedAt: null,
    userId: user.id
  };
  const refreshTokenTable = await createRefreshToken(newRefreshToken);
  
  const response = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token,
    refreshToken: refreshTokenTable.token,
    isChirpyRed: user.isChirpyRed,
  };

  res.header("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(response));
}
