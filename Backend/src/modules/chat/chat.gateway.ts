import { Router } from "express";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { Socket, Server } from "socket.io";
import { ChatNS } from "./chat";
import { UserServices } from "../../modules/user/user.services";
import { RoomServices } from "modules/room/room.services";
import { MessageServices } from "modules/message/message.services";
import { MessageNS } from "modules/message/message";
import { PageOptionsDto } from "common/dtos/page.options";

export function ChatGateWay(
  ws: Server,
  userServices: UserServices,
  roomServices: RoomServices,
  messageServices: MessageServices
) {
  const router = Router();
  const connectedClients = new Object();
  // INFO: handle token
  const handleGetMe = async (client: Socket): Promise<string> => {
    const { token } = client.handshake.auth;
    if (!token) {
      console.log(`Missing token`);
      return;
    }
    const user_id = await JwtStrategy(token);
    connectedClients[user_id] = client.id
    client["senderId"] = user_id;
    
    return user_id;
  };

  // INFO: handle disconnect
  const handleDisconnect = (client: Socket) => {
    client.on("disconnect", () => {
      console.log(`client_id ${client.id} disconnected`);
      for (let key in connectedClients) {
        if (connectedClients[key] === client.id) {
          delete connectedClients[key];
        }
      }
    });
  };

  // INFO: handle connection
  const handleConnect = async (client: Socket) => {
    const userId = await handleGetMe(client);
    // INFO: send user info to client websocket
    const me = await userServices.findOne(userId);
    client.emit(ChatNS.MessageType.GetMe, me);
  };

  // INFO: config websocket event
  ws.on("connection", async (client: Socket) => {
    await handleConnect(client);
    // INFO: listen join box chat
    client.on(ChatNS.MessageType.JoinBox, async (roomId: string) => {
      client["roomId"] = roomId;
      const room = await roomServices.findOne(roomId);
      client.join(client["roomId"])
      console.log(Array.from(ws.sockets.adapter.rooms.get(roomId)), 'room info after user join');
      // INFO: check user in room, a lười nên validate ở đây, nên validate bên message services :))
      if (room.user_id.includes(client["senderId"])) {
        const message = await messageServices.findAll(client["senderId"], roomId, {
          page: +1,
          limit: +50,
        });
        client.emit(ChatNS.MessageType.JoinBox, message);
      }
    });

    client.on(ChatNS.MessageType.ScrollMessage, async (params: PageOptionsDto) => {
      const senderId = client["senderId"];
      const roomId =  client["roomId"];
      
      const messages = await messageServices.findAll(senderId, roomId, params);
      client.emit(ChatNS.MessageType.ScrollMessage, messages);
    });

    //INFO: listen leave box chat
    client.on(ChatNS.MessageType.LeaveBox, async (roomId: string) => {
      const senderId = client["senderId"];
      // client.leave(roomId)
      console.log(Array.from(ws.sockets.adapter.rooms.get(roomId)), `${senderId} leave. room info after user leave'`);
    });

    // INFO: listen new message
    client.on(ChatNS.MessageType.NewMessage, async (content: string) => {
      const roomId = client["roomId"];
      const senderId = client["senderId"];
      console.log(connectedClients, 'connectedClients');
      const roomInfo = ws.sockets.adapter.rooms.get(roomId);
      const connections = roomInfo ? Array.from(roomInfo) : [];
      console.log('Connections in room:', connections);
      
      if (roomId && senderId) {
        const room = await roomServices.findOne(roomId);
        const to = room.user_id.find((id) => id !== senderId);
        // INFO: call services create new message
        const params: MessageNS.CreateMessageParams = {
          room_id: roomId,
          from: senderId,
          to,
          message: content,
        };
        await messageServices.create(params);
        const messages = await messageServices.findAll(senderId, roomId, {
          page: +1,
          limit: +50,
        });
        client.emit(ChatNS.MessageType.NewMessage, messages);
        const targetClient = connectedClients[to]
        if(connections.includes(targetClient)){
          client.to(targetClient).emit(ChatNS.MessageType.NewMessage, messages);
        } else {
          client.to(targetClient).emit(ChatNS.MessageType.LoadBox, true);
        }
        
      }
    });

    handleDisconnect(client);
  });

  return router;
}