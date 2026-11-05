import { Request, Response } from "express";

export async function users(req: Request, res: Response) {
  res.set("Content-Type", "text/html");
  res.set("charset", "utf-8");
  res.send(`<html><body><h1>Users</h1></body></html>`);
}
