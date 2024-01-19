import { MessageNS } from "modules/message/message";
import rand from "../../common/rand";
import { UserNS } from "modules/user/user";

export namespace RoomNS {

  export interface Room {
    id: string;
    user_id: Array<string>;
    created_at: number;
    updated_at: number;
  }

  export interface ViewRoom extends Room {
    message?: MessageNS.Message;
    users?: UserNS.User[];
  }
  export interface CreateRoomParams {
    uid_send: string;
    uid_receive: string;
  }

  export interface UpdateRoomParams {
    updated_at: number;
  }

  export interface Services {
    findAll(userId: string): Promise<ViewRoom[]>;
    findOne(id: string): Promise<Room>;
    findOneByUser(id: Array<string>): Promise<Room>;
    create(params: CreateRoomParams): Promise<Room>;
    update(id: string, params: UpdateRoomParams): Promise<Room>;
  }

  export interface Repository {
    findAll(userId: string): Promise<ViewRoom[]>;
    findOne(id: string): Promise<Room>;
    create(room: Room): Promise<void>;
    update(room: Room): Promise<void>;
  }

  export const Errors = {
    NotFound: new Error("room not found"),
    Existed: new Error("room existed"),
  };

  export const Generators = {
    NewRoomId: (l = 8): string => rand.uppercase(l),
  };
}