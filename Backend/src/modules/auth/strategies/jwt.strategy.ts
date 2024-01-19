import { configServices } from "../../../config";
import jwt from "jsonwebtoken";

export async function JwtStrategy(token: string): Promise<string> {
  const jwtConfig = configServices.getJWTConfig();
  await jwt.verify(token, jwtConfig.secretKey);
  const decode: any = await jwt.decode(token);
  return decode.id;
}