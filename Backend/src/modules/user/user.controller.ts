import { Router } from "express";
import { UserServices } from "./user.services";
import { HttpParamValidators } from "../../lib/http";
import { PageOptionsDto } from "../../common/dtos/page.options";
import { UserNS } from "./user";

export function UserController(userServices: UserServices) {
	const router = Router();

	const gender = Object.values(UserNS.Gender).filter(v => !isNaN(Number(v))) as number[];

	router.get("/", async (req, res) => {
		const { page, limit } = req.query;
		const query = new PageOptionsDto(+page, +limit);
		const docs = await userServices.findAll(query);
		res.json(docs);
	});

	router.get("/:id", async (req, res) => {
		const id = HttpParamValidators.MustBeString(req.params, "id", 2);
		const user = await userServices.findOne(id);
		res.send(user);
	});

	router.post("/", async (req, res) => {
    const params: UserNS.CreateUserParams = {
      fullname: HttpParamValidators.MustBeString(req.body, "fullname", 2),
      dob: HttpParamValidators.MustBeString(req.body, "dob", 2),
      email: HttpParamValidators.MustBeString(req.body, "email", 2),
      phone: HttpParamValidators.MustBeString(req.body, "phone", 2),
      username: HttpParamValidators.MustBeString(req.body, "username", 2),
      password: HttpParamValidators.MustBeString(req.body, "password", 6),
			gender: HttpParamValidators.MustBeOneOf(req.body, "gender", gender),
    };
    const user = await userServices.create(params);
    res.json(user);
  });

	return router;
};