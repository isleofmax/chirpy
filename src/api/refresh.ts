import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "./auth.js";
import { UnauthorizedError } from "./errors.js";
import { userForRefreshToken } from "../db/queries/refreshTokens.js";
import { type NewRefreshToken } from "../db/schema.js";
import { config } from "../config.js";

export async function refresh(req: Request, res: Response) {
  const token = getBearerToken(req);
  if (! token) {
    throw new UnauthorizedError("Unauthorized");
  }

  const refreshToken: NewRefreshToken = await userForRefreshToken(token);
  if (! refreshToken) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (refreshToken.revokedAt) {
    throw new UnauthorizedError("Unauthorized: refresh token revoked");
  }

  if (refreshToken.expiresAt) {
    const now = Date.now();
    const expires = Date.parse(refreshToken.expiresAt.toString());
    if (now > expires) {
      throw new UnauthorizedError("Unauthorized: refresh token expired");
    }
  }

  const newJwt = makeJWT(refreshToken.userId, 3600, config.apiConfig.secret);

  type params = {
    token: string;
  };
  const result: params = { token: newJwt };
  res.status(200).send(JSON.stringify(result));
}
