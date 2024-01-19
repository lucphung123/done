import { PaginationResponseDto } from "../../common/dtos/pagination.response";
import { PageOptionsDto } from "../../common/dtos/page.options";
import { MessageNS } from "./message";
import { MessageRepository } from "./message.repository";
import { RoomServices } from "modules/room/room.services";
type Message = MessageNS.Message;

export class MessageServices implements MessageNS.Services {
  constructor(private messageRepo: MessageRepository, private roomServices: RoomServices) {}

  async findAll(user_id: string, roomId: string, query?: PageOptionsDto ): Promise<PaginationResponseDto<Message>> {
    const messages = await this.messageRepo.findAll(user_id, roomId, query);
    messages.data.reverse();
    return messages;
  }
  
  async findOne(id: string): Promise<Message> {
    const room = await this.messageRepo.findOne(id);
    if (!room) throw MessageNS.Errors.NotFound;
    return room;
  }

  async create(
    params: MessageNS.CreateMessageParams
  ): Promise<Message> {
    const message: Message = {
      id: MessageNS.Generators.NewMessageId(),
      room_id: params.room_id,
      created_at: Date.now(),
      updated_at: Date.now(),
      from: params.from,
      to: params.to,
      message: params.message,
      status_read: false
    };
    await this.messageRepo.create(message);
    // const paramsUpdate = {
    //   updated_at: Date.now(),
    //   last_message: {
    //     id: message.id,
    //     message: message.message,
    //     status_read: false
    //   } 
    // }
    // await this.roomServices.update(message.room_id, paramsUpdate)
    return message;
  }

  async update(id: string, params: MessageNS.UpdateMessageParams): Promise<Message> {
    const message = await this.findOne(id);
    message.updated_at = Date.now();
    const newMessage = { ...message, ...params };
    await this.messageRepo.update(newMessage);
    return newMessage;
  }
}