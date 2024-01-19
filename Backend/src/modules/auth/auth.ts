import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserNS } from "../user/user";
import { configServices } from "../../config";

export namespace AuthNS {
  const jwtConfig = configServices.getJWTConfig();

  export interface AuthPayload {
    user: UserNS.User,
    access_token: {
      value: string,
      expires_in: number
    },
    refresh_token: {
      value: string,
      expires_in: number
    }
  }

  export enum TokenType {
    AccessToken = "access_token",
    RefreshToken = "refresh_token"
  }
  export interface LoginParams {
    username: string;
    password: string;
  }

  export interface Services {
    login(params: LoginParams): Promise<AuthPayload>;
    register(
      params: UserNS.CreateUserParams
    ): Promise<UserNS.User>;
    me(id: string): Promise<UserNS.User>;
    refreshToken(token: string): Promise<AuthPayload>
  }

  export const Errors = {
    WrongPassword: new Error("wrong password"),
    WrongHeaders: "header must be bearer",
    MissingToken: "missing token",
  };

  export const Utils = {
    hashPassword: (password: string): string => bcryptjs.hashSync(password),
    comparePassword: (password: string, hashPw: string): boolean =>
      bcryptjs.compareSync(password, hashPw),
    createAccessToken: async (id: string): Promise<string> =>
      await jwt.sign({ id, type: TokenType.AccessToken }, jwtConfig.secretKey, {
        expiresIn: jwtConfig.tokenExpired,
      }),
    createRefreshToken: async (id: string): Promise<string> =>
      await jwt.sign({ id, type: TokenType.RefreshToken }, jwtConfig.refeshSecretKey, {
        expiresIn: jwtConfig.refreshExpried,
      }),
  };
}