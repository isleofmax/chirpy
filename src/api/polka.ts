import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { updateUserToChirpyRed } from "../db/queries/users.js";

export async function polkaWebhooks(req: Request, res: Response) {
  type Data = {
    userId: string;
  }

  type Parameters = {
    event: string;
    data: Data;
  }

  const body: Parameters = req.body;
  if (!body.event || !body.data.userId) {
    throw new BadRequestError("Bad Request: invalid params");
  }

  if (body.event !== "user.upgraded") {
    res.status(204).send("NOT OK");
    return;
  }

  const userId = body.data.userId;
  const user = await updateUserToChirpyRed(userId);
  if (!user) {
    throw new NotFoundError("Not Found: user not found");
  }

  res.status(204).send("OK");
}
