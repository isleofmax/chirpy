import { Request, Response } from "express";
import { getBearerToken } from "./auth.js";
import type { NewRefreshToken } from "../db/schema.js";
import { revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./errors.js";

export async function revoke(req: Request, res: Response) {
  const token = getBearerToken(req);
  if (! token) {
    throw new UnauthorizedError("Unauthorized");
  }

  const refreshToken: NewRefreshToken = await revokeRefreshToken(token);
  if (!refreshToken) {
    throw new UnauthorizedError("Unauthorized");
  }

  res.status(204).send("");
}
