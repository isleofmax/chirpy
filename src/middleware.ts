import type { Request, Response, NextFunction } from "express";


export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  console.log("log responses");
  next();
}
