import { MessageNS } from "./message";
import { Db } from "mongodb";
import {
  FromMongoData,
  MongoErrorCodes,
  MongoModel,
  ToMongoData,
} from "../../database/mongo";
import { PaginationResponseDto } from "../../common/dtos/pagination.response";
import { PageOptionsDto } from "common/dtos/page.options";
type Message = MessageNS.Message;

export class MessageRepository implements MessageNS.Repository {
  constructor(private db: Db) {}

  private col_message =
    this.db.collection<MongoModel<MessageNS.Message>>("message");

  async findAll(
    user_id: string,
    roomId: string,
    query?: PageOptionsDto
  ): Promise<PaginationResponseDto<Message>> {
    // change status all message of this room to "read"
    await this.col_message.bulkWrite([
      {
        updateMany: {
          filter: { to: user_id, room_id: roomId,  status_read: false },
          update: { $set: { status_read: true, updated_at: Date.now() } },
        },
      },
    ]);
    const { page, limit } = query;
    const conditions = [
      { $match: { room_id: roomId } },
      { $sort: { created_at: -1 } },
    ];
    const docs = await this.col_message["paginate"](page, limit, conditions);
    return docs;
  }

  async findOne(id: string): Promise<Message> {
    const doc = await this.col_message.findOne({ _id: id });
    return FromMongoData.One(doc);
  }

  async create(message: Message): Promise<void> {
    try {
      const doc = ToMongoData.One(message);
      await this.col_message.insertOne(doc);
    } catch (e) {
      if (e.code === MongoErrorCodes.Duplicate) {
        throw MessageNS.Errors.Existed;
      }
      throw e;
    }
  }

  async update(message: Message): Promise<void> {
    try {
      const doc = ToMongoData.One(message);
      await this.col_message.updateOne({ _id: message.id }, { $set: doc });
    } catch (e) {
      throw e;
    }
  }
}