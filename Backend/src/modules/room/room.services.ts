import { RoomNS } from "./room";
import { RoomRepository } from "./room.repository";
import { UserServices } from "modules/user/user.services";

type Room = RoomNS.Room;
type ViewRoom = RoomNS.ViewRoom;
export class RoomServices implements RoomNS.Services {
  constructor(
    private roomRepo: RoomRepository,
  ) {}

  async findAll(userId: string): Promise<ViewRoom[]> {
    const rooms = await this.roomRepo.findAll(userId);
    const result = await Promise.all(
      rooms.map((r) => {
        if (r.message) {
          r.message.status_read =
          r.message.from === userId ? true : r.message.status_read;
        }
        return r;
      })
    );
    return result;
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepo.findOne(id);
    if (!room) throw RoomNS.Errors.NotFound;
    return room;
  }

  async findOneByUser(id: Array<string>): Promise<Room> {
    const room = await this.roomRepo.findOneByUser(id.sort());
    if (!room) throw RoomNS.Errors.NotFound;
    return room;
  }

  async create(params: RoomNS.CreateRoomParams): Promise<Room> {
    const room: Room = {
      id: RoomNS.Generators.NewRoomId(),
      user_id: [params.uid_send, params.uid_receive].sort(),
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await this.roomRepo.create(room);
    return room;
  }

  async update(id: string, params: RoomNS.UpdateRoomParams): Promise<Room> {
    const room = await this.findOne(id);
    room.updated_at = Date.now();
    const newRoom = { ...room, ...params };
    await this.roomRepo.update(newRoom);
    return newRoom;
  }
}