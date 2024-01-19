import { Db } from "mongodb";
import { RoomNS } from "./room";
import {
  FromMongoData,
  MongoErrorCodes,
  MongoModel,
  ToMongoData,
} from "../../database/mongo";
import { MessageNS } from "modules/message/message";
import { UserNS } from "modules/user/user";
type Room = RoomNS.Room;
type ViewRoom = RoomNS.ViewRoom;
export class RoomRepository implements RoomNS.Repository {
  constructor(private db: Db) {}

  private col_room = this.db.collection<MongoModel<RoomNS.Room>>("box_chat");

  async findAll(userId: string): Promise<ViewRoom[]> {
    const conditions = [
      { $match: { user_id: userId } },
      {
        $lookup: {
          from: "message",
          localField: "_id",
          foreignField: "room_id",
          as: "message",
        },
      },
      { $addFields: { message: { $last: "$message" } } },
      {
        $lookup: {
          from: "user",
          let: { uid: "$user_id" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$uid"] } } },
            { $project: { _id: 1, username: 1, fullname: 1, gender: 1 } },
          ],
          as: "users",
        },
      },
    ];

    const docs = (await this.col_room
      .aggregate(conditions)
      .toArray()) as MongoModel<ViewRoom>[];

    const newDocs = docs.map((d: MongoModel<ViewRoom>) => ({
      ...d,
      ...{
        message: d.message
          ? (FromMongoData.One(d.message as any) as MessageNS.Message)
          : null,
        users: FromMongoData.Many(d.users as any) as UserNS.User[],
      },
    }));
    return FromMongoData.Many(newDocs);
  }

  async findOne(id: string): Promise<Room> {
    const doc = await this.col_room.findOne({ _id: id });
    return FromMongoData.One(doc);
  }

  async findOneByUser(user_id: Array<string>): Promise<Room> {
    const doc = await this.col_room.findOne({
      user_id: {
        $eq: user_id,
      },
    });
    return FromMongoData.One(doc);
  }

  async create(room: Room): Promise<void> {
    try {
      const doc = ToMongoData.One(room);
      await this.col_room.insertOne(doc);
    } catch (e) {
      if (e.code === MongoErrorCodes.Duplicate) {
        throw RoomNS.Errors.Existed;
      }
      throw e;
    }
  }

  async update(room: Room): Promise<void> {
    try {
      const doc = ToMongoData.One(room);
      await this.col_room.updateOne({ _id: room.id }, { $set: doc });
    } catch (e) {
      throw e;
    }
  }
}