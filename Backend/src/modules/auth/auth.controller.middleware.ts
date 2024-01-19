import { SuccessReponseDto } from "../../common/dtos/success.response";
import { Request, Response, NextFunction } from "express";
import { AuthNS } from "./auth";
import { configServices } from "../../config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { HttpParamValidators, HttpStatusCodes } from "../../lib/http";

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  const jwtConfig = configServices.getJWTConfig();
  try {
    if (!authorization || !authorization.includes(jwtConfig.tokenType)) {
      return res
        .status(HttpStatusCodes.Unauthorized)
        .json(new SuccessReponseDto(false, null, AuthNS.Errors.WrongHeaders));
    } else {
      const token = authorization.substr(`${jwtConfig.tokenType} `.length);
      if (!token) {
        return res
          .status(HttpStatusCodes.Unauthorized)
          .json(new SuccessReponseDto(false, null, AuthNS.Errors.MissingToken));
      }
      const user_id = await JwtStrategy(token);
      req.query.user_id = user_id;
    }
  } catch (e) {
    return res.status(HttpStatusCodes.Unauthorized).json(new SuccessReponseDto(false, null, e.message));
  }
  next();
}

export function GetAuthData(req: Request): string {
  HttpParamValidators.MustBeString(req.query, 'user_id', 5);
  return String(req.query.user_id);
}