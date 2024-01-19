import { Router } from "express";
import { HttpParamValidators } from "../../lib/http";
import { MessageServices } from "./message.services";
import { MessageNS } from "./message";
import { PageOptionsDto } from "../../common/dtos/page.options";
import { GetAuthData } from "../auth/auth.controller.middleware";

// A nghĩ không cần api tạo message, message sẽ được tạo ở tầng services, cần api list message theo room khi chọn room
export function MessageController(messageServices: MessageServices) {
  const router = Router();
  
  router.get("/:roomId", async (req, res) => {
    const { page, limit } = req.query;
    const userId = GetAuthData(req);
		const query = new PageOptionsDto(+page, +limit);
    const roomId = HttpParamValidators.MustBeString(req.params, 'roomId', 3);
    const messages = await messageServices.findAll(userId, roomId, query);
    res.json(messages);
  });

  router.post("/", async (req, res) => {
    const params: MessageNS.CreateMessageParams = {
      from: HttpParamValidators.MustBeString(req.body, "from", 2),
      to: HttpParamValidators.MustBeString(req.body, "to", 2),
      message: HttpParamValidators.MustBeString(req.body, "message", 2),
      room_id: HttpParamValidators.MustBeString(req.body, "room_id", 2),
    };
    const message = await messageServices.create(params);
    res.json(message);
  });

  return router;
}