import type { Request, Response } from "express";

export function readiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  res.set("charset", "utf-8");
  res.send("OK");
}
