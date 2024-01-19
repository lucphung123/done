import { Router } from "express";
import { AuthServices } from "./auth.services";
import { AuthNS } from "./auth";
import { HttpParamValidators } from "../../lib/http";
import { UserNS } from "../user/user";
import { AuthMiddleware } from "./auth.controller.middleware";

export function AuthController(authServices: AuthServices) {
  const router = Router();

  const gender = Object.values(UserNS.Gender).filter(v => !isNaN(Number(v))) as number[];
  
  router.post("/login", async (req, res) => {
    const params: AuthNS.LoginParams = {
      username: HttpParamValidators.MustBeString(req.body, "username", 2),
      password: HttpParamValidators.MustBeString(req.body, "password", 6),
    };
    const doc = await authServices.login(params);
    res.json(doc);
  });

  router.post("/register", async (req, res) => {
    const params: UserNS.CreateUserParams = {
      fullname: HttpParamValidators.MustBeString(req.body, "fullname", 2),
      dob: HttpParamValidators.MustBeString(req.body, "dob", 6),
      email: HttpParamValidators.MustBeString(req.body, "email", 6),
      phone: HttpParamValidators.MustBeString(req.body, "phone", 10),
      username: HttpParamValidators.MustBeString(req.body, "username", 6),
      password: HttpParamValidators.MustBeString(req.body, "password", 6),
      gender: HttpParamValidators.MustBeOneOf(req.body, "gender", gender),
    };
    const user = await authServices.register(params);
    res.json(user);
  });

  router.post("/refresh-token", async (req, res) => {
    const token = HttpParamValidators.MustBeString(
      req.body,
      "refresh_token",
      10
    );
    const refreshToken = await authServices.refreshToken(token);
    res.json(refreshToken);
  });

  router.use(AuthMiddleware);
  router.get("/me", async (req, res) => {
    const { user_id } = req.query;
    const me = await authServices.me(user_id as string);
    return res.json(me);
  });

  return router;
}