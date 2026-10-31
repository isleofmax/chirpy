import type { Request, Response } from "express";
import { config } from "../config.js";

export async function metrics(req: Request, res: Response) {
  const hits = config.fileserverHits;
  res.set("Content-Type", "text/html");
  res.set("charset", "utf-8");
  res.send(`<html><body><h1>Welcome, Chirpy Admin</h1><p>Chirpy has been visited ${hits} times!</p></body></html>`);
}
