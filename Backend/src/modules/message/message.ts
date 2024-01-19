import { PageOptionsDto } from "../../common/dtos/page.options";
import { PaginationResponseDto } from "../../common/dtos/pagination.response";
import rand from "../../common/rand";

export namespace MessageNS {
  export interface Message{
    created_at: number,
    updated_at: number,
    id: string,
    room_id: string,
    from: string,
    to: string,
    message: string,
    status_read: boolean
  }

  export interface CreateMessageParams {
    room_id: string,
    from: string,
    to: string,
    message: string
  }

  export interface UpdateMessageParams {
    room_id: string,
    status: boolean
  }

  export interface Services {
    findAll(user_id: string, roomId: string, query?: PageOptionsDto): Promise<PaginationResponseDto<Message>>;
    findOne(id: string): Promise<Message>;
    create(params: CreateMessageParams): Promise<Message>;
    update(id: string, params: UpdateMessageParams): Promise<Message>;
  }

  export interface Repository {
    findAll(user_id: string, roomId: string, query: PageOptionsDto): Promise<PaginationResponseDto<Message>>;
    findOne(id: string): Promise<Message>;
    create(message: Message): Promise<void>;
    update(message: Message): Promise<void>;
  }

  export const Errors = {
    NotFound: new Error("message not found"),
    Existed: new Error("message existed"),
  };

  export const Generators = {
    NewMessageId: (l = 8): string => rand.uppercase(l),
  };

}