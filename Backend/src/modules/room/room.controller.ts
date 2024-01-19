import { Router } from "express";
import { HttpParamValidators } from "../../lib/http";
import { RoomNS } from "./room";
import { RoomServices } from "./room.services";
import { AuthMiddleware, GetAuthData } from "../auth/auth.controller.middleware";

export function RoomController(roomServices: RoomServices) {
  const router = Router();

  // TODO: get room by token 
  router.use(AuthMiddleware)
  router.get("/", async (req, res) => {
    const userId = GetAuthData(req);
    const rooms = await roomServices.findAll(userId);
    res.json(rooms);
  });

  // router.get("/user", async (req, res) => {
  //   const uid_send = HttpParamValidators.MustBeString(req.query, "uid_send", 2);
  //   const uid_receive = HttpParamValidators.MustBeString(req.query, "uid_receive", 2);

  //   const id = [String(uid_send), String(uid_receive)];
  //   const room = await roomServices.findOneByUser(id);
  //   res.json(room);
  // });

  router.get("/:id", async (req, res) => {
    const id = HttpParamValidators.MustBeString(req.params, "id", 2);
    const room = await roomServices.findOne(id);
    res.json(room);
  });

  router.post("/", async (req, res) => {
    const params: RoomNS.CreateRoomParams = {
      uid_send: HttpParamValidators.MustBeString(req.body, "uid_send", 2),
      uid_receive: HttpParamValidators.MustBeString(req.body, "uid_receive", 2),
    };
    const room = await roomServices.create(params);
    res.json(room);
  });

  return router;
}