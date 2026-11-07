import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    if (res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.apiConfig.fileserverHits++;
  next();
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof BadRequestError) {
    res.status(400).send(JSON.stringify({ error: err.message }));
    return;
  } else if (err instanceof ForbiddenError) {
    res.status(403).send(JSON.stringify({ error: err.message }));
    return;
  } else if (err instanceof NotFoundError) {
    res.status(404).send(JSON.stringify({ error: err.message }));
    return;
  }
  console.log("500 - Internal Server Errors");
}
