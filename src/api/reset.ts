import type { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";

export async function reset(req: Request, res: Response) {
  config.apiConfig.fileserverHits = 0;
  if (config.apiConfig.platform !== "dev") {
    throw new ForbiddenError("403 Forbidden");
  }
  await deleteUsers();
  res.write("Hits reset to 0");
  res.end();
}
