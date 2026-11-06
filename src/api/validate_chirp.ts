import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";

export async function validateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const parsedBody: parameters = req.body;

  res.header("Content-Type", "application/json");
  if (!parsedBody.body || parsedBody.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const words = parsedBody.body.split(" ");
  const newWords = [];
  for (let word of words) {
    const appWord = word;
    if (word.toLowerCase() === "kerfuffle" || word.toLowerCase() === "sharbert" || word.toLowerCase() === "fornax") {
      newWords.push("****");
    } else {
      newWords.push(word);
	}
  }
  const newPhrase = newWords.join(" ");

  console.log("chirp");
  res.status(200).send(JSON.stringify({ cleanedBody: newPhrase }));
}
