import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./common/log";
import "./lib/express";
import "./boilerplate.polyfill";
import { configServices } from "./config";
import { MongoConnect } from "./database/mongo";
import { HttpErrorHandler } from "./middleware/http.error.handler";
import { HttpStatusCodeHandler } from "./middleware/http.status.code.handler";
import { SuccessResponseHandler } from "./middleware/response.handler";
import { TodoRepository } from "./modules/todo/todo.repository";
import { TodoServices } from "./modules/todo/todo.services";
import { TodoController } from "./modules/todo/todo.controller";
import { AuthController } from "./modules/auth/auth.controller";
import { UserRepository } from "./modules/user/user.repository";
import { UserServices } from "./modules/user/user.services";
import { UserController } from "./modules/user/user.controller";
import { AuthServices } from "./modules/auth/auth.services";
import { HealthCheckController } from "./modules/health-check/health.check.controller";
import { ChatGateWay } from "./modules/chat/chat.gateway";

import { RoomController } from "./modules/room/room.controller";
import { RoomServices } from "./modules/room/room.services";
import { RoomRepository } from "./modules/room/room.repository";

import { MessageController } from "./modules/message/message.controller";
import { MessageRepository } from "./modules/message/message.repository";
import { MessageServices } from "./modules/message/message.services";

async function main() {
  // INFO: connect database
  const dbConfig = configServices.getDBConfig();
  console.log(dbConfig);
  const client = await MongoConnect(dbConfig.URL);
  const db = client.db(dbConfig.Name);

  // INFO: config application
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.disable("x-powered-by");

  // INFO: health-check
  app.use("/health", HealthCheckController());

  // INFO: middleware
  app.use(HttpStatusCodeHandler);
  app.use(SuccessResponseHandler);

  // INFO: todo
  const todoRepo = new TodoRepository(db);
  await todoRepo.init();
  const todoServices = new TodoServices(todoRepo);
  app.use("/todos", TodoController(todoServices));

  // INFO: user
  const userRepo = new UserRepository(db);
  await userRepo.init();
  const userServices = new UserServices(userRepo);
  app.use("/users", UserController(userServices));

  // INFO: auth
  const authServices = new AuthServices(userServices);
  app.use("/auth", AuthController(authServices));

  // INFO: room
  const roomRepo = new RoomRepository(db);
  const roomServices = new RoomServices(roomRepo);
  app.use("/rooms", RoomController(roomServices));

  // INFO: room
  const messageRepo = new MessageRepository(db);
  const messageServices = new MessageServices(messageRepo, roomServices);
  app.use("/messages", MessageController(messageServices));

  // INFO: config websocket
  const server = http.createServer(app);
  const wss = new Server(server);
  app.use("/", ChatGateWay(wss, userServices, roomServices, messageServices));

  app.use(HttpErrorHandler);
  const timeZone = configServices.getTimeZone();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault(timeZone);

  const PORT = configServices.getPORT();
  server.listen(PORT);
  console.log(`Server listen on ${PORT}`);
}

main().catch((err) => console.log(err));