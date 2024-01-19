import { UserServices } from "modules/user/user.services";
import { AuthNS } from "./auth";
import { UserNS } from "modules/user/user";
import { configServices } from "../../config";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh-strategy";

export class AuthServices implements AuthNS.Services {
  constructor(private userServices: UserServices) {}

  async login(
    params: AuthNS.LoginParams
  ): Promise<AuthNS.AuthPayload> {
    const { username, password } = params;
    const user = await this.userServices.findByUserName(username);
    const isPassword = AuthNS.Utils.comparePassword(
      password,
      user.password
    );
    if (!isPassword) throw AuthNS.Errors.WrongPassword;
    const { id } = user;
    delete user.password;
    const jwtConfig = configServices.getJWTConfig();
    const payload: AuthNS.AuthPayload = {
      user,
      access_token: {
        value: await AuthNS.Utils.createAccessToken(id),
        expires_in: jwtConfig.tokenExpired,
      },
      refresh_token: {
        value: await AuthNS.Utils.createRefreshToken(id),
        expires_in: jwtConfig.refreshExpried,
      },
    };
    return payload;
  }

  async register(
    params: UserNS.CreateUserParams
  ): Promise<UserNS.User> {
    const result = await this.userServices.create(params);
    return result;
  }

  async me(id: string): Promise<UserNS.User> {
    return await this.userServices.findOne(id);
  }

  async refreshToken(token: string): Promise<AuthNS.AuthPayload> {
    const decode = await JwtRefreshStrategy(token);
    const { id, type } = decode;
    if (type === AuthNS.TokenType.RefreshToken && id) {
      const user = await this.userServices.findOne(id);
      const jwtConfig = configServices.getJWTConfig();
      const payload: AuthNS.AuthPayload = {
        user,
        access_token: {
          value: await AuthNS.Utils.createAccessToken(id),
          expires_in: jwtConfig.tokenExpired,
        },
        refresh_token: {
          value: token,
          expires_in: jwtConfig.refreshExpried,
        },
      };
      return payload;
    }
   throw AuthNS.Errors.MissingToken;
  }
}