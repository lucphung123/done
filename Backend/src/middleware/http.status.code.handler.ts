import { Request, Response, NextFunction } from "express";
import { HttpMethods } from "../lib/http";

export function HttpStatusCodeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(HttpMethods[req.method]);
  next();
}