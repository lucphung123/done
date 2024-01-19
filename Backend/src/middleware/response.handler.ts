import { HttpStatusCodes } from "lib/http";
import { SuccessReponseDto } from "../common/dtos/success.response";
import { Request, NextFunction } from "express";
import { successMessage } from "../common/const";

export function SuccessResponseHandler(req: Request, res, next: NextFunction) {
  const { json } = res;
  res.json = function <T>(data: T) {
    const isSuccess = res.statusCode < HttpStatusCodes.BadRequest;
    if (isSuccess) {
      if (data?.hasOwnProperty?.("data") && data?.hasOwnProperty?.("meta")) {
        const paginate = data['data'];
        arguments[0] = new SuccessReponseDto(true, paginate, successMessage, data["meta"]);
      } else {
        arguments[0] = new SuccessReponseDto(true, data, successMessage);
      }
    }
    json.apply(res, arguments);
  };
  next();
}