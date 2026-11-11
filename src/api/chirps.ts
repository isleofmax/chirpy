import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { getUserById } from "../db/queries/users.js";
import type { NewChirp } from "../db/schema.js";
import { createChirp, chirpsOrderByCreation, chirpById } from "../db/queries/chirps.js";

export async function createNewChirp(req: Request, res: Response) {
  type Parameters = {
    body: string;
    userId: string;
  };

  const params: Parameters = await req.body;
  if (!params.userId || !params.body) {
    throw new BadRequestError("Bad request: invaid parameters");
  }

  const chirpMessage = validateChirp(params.body);
  const user = await getUserById(params.userId);
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

export async function getChirpsByCreation(req: Request, res: Response) {
  const result = await chirpsOrderByCreation();
  res.status(200).send(JSON.stringify(result));
}

export async function getChirpById(req: Request, res: Response) {
  const { chirpId } = req.params;
  
  if (!chirpId || typeof chirpId !== "string") {
    throw new BadRequestError("Bad request: invaid parameters");
  }
  const result = await chirpById(chirpId);
  if (!result) {
    throw new NotFoundError("Chirp not found");
  }
  res.status(200).send(JSON.stringify(result));
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

