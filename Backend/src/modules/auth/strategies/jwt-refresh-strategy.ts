import { configServices } from "../../../config";
import jwt from "jsonwebtoken";

export async function JwtRefreshStrategy(token: string): Promise<{ id: string, type: string }> {
  const jwtConfig = configServices.getJWTConfig();
  await jwt.verify(token, jwtConfig.refeshSecretKey);
  const decode: any = await jwt.decode(token);
  return decode;
}