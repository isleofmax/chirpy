import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { findUser } from "../db/queries/users.js";
import type { NewChirp } from "../db/schema.js";
import { createChirp } from "../db/queries/chirps.js";

export async function chirps(req: Request, res: Response) {
  type Parameters = {
    body: string;
    userId: string;
  };

  const params: Parameters = await req.body;
  if (!params.userId || !params.body) {
    throw new BadRequestError("Bad request: invaid parameters");
  }

  const chirpMessage = validateChirp(params.body);
  const user = await findUser(params.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const chirp: NewChirp = {
    body: chirpMessage,
    userId: user.id
  };

  const result = await createChirp(chirp);
  if (!result) {
    throw new Error("Could not create chirp");
  }
  res.header("Content-Type", "application/json");
  res.status(201).send(JSON.stringify(result));
}

function validateChirp(body: string) {
  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const words = body.split(" ");
  const newWords = [];
  for (let word of words) {
    const appWord = word;
    if (word.toLowerCase() === "kerfuffle" || word.toLowerCase() === "sharbert" || word.toLowerCase() === "fornax") {
      newWords.push("****");
    } else {
      newWords.push(word);
	  }
  }
  return newWords.join(" ");
}

