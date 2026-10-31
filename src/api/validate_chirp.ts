import { Request, Response } from "express";

export async function validateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const parsedBody: parameters = req.body;

  res.header("Content-Type", "application/json");
  if (!parsedBody.body || parsedBody.body.length > 140) {
    res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
    return;
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

  res.status(200).send(JSON.stringify({ cleanedBody: newPhrase }));
}
