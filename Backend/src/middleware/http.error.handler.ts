import { Request, Response } from 'express';
import { AuthNS } from "../modules/auth/auth";
import { TodoNS } from "../modules/todo/todo";
import { HttpError, HttpStatusCodes } from "../lib/http";
import { UserNS } from "../modules/user/user";
import { SuccessReponseDto } from "../common/dtos/success.response";
import { PageErrors } from "../boilerplate.polyfill";
import { RoomNS } from '../modules/room/room';
import { MessageNS } from '../modules/message/message';

const commonErrors = new Set([
  ...Object.values(TodoNS.Errors),
  ...Object.values(AuthNS.Errors),
  ...Object.values(UserNS.Errors),
  ...Object.values(RoomNS.Errors),
  ...Object.values(MessageNS.Errors),
  ...Object.values(PageErrors),
]);

export function HttpErrorHandler(err, req: Request, res: Response, next) {
  if (commonErrors.has(err)) {
    err = new HttpError(err.message, HttpStatusCodes.BadRequest);
  }
  if (err && typeof err.HttpStatusCode === "function") {
    const message = err.message;
    const response = new SuccessReponseDto(false, null, message);
    res.status(err.HttpStatusCode() || 500).json(response);
    return;
  }
  console.log(err);
  res.status(500).send({
    error: "internal server error",
  });
}