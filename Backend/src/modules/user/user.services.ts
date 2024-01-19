import { AuthNS } from "../auth/auth";
import { UserNS } from "./user";
import { UserRepository } from "./user.repository";
import { PaginationResponseDto } from "common/dtos/pagination.response";
import { PageOptionsDto } from "common/dtos/page.options";
import { TodoServices } from "modules/todo/todo.services";

type User = UserNS.User;

export class UserServices implements UserNS.Services {
  constructor(private userRepo: UserRepository) {}

  async findAll(query: PageOptionsDto): Promise<PaginationResponseDto<User>> {
    const users = await this.userRepo.findAll(query);
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne(id);
    if (!user) throw UserNS.Errors.NotFound;
    return user;
  }

  async findByUserName(username: string): Promise<User> {
    const user = await this.userRepo.findByUserName(username);
    if (!user) throw UserNS.Errors.NotFound;
    return user;
  }

  async create(
    params: UserNS.CreateUserParams
  ): Promise<User> {
    const user: User = {
      id: UserNS.Generators.NewUserId(),
      ...params,
      ctime: Date.now(),
      mtime: Date.now(),
    };
    user.password = AuthNS.Utils.hashPassword(params.password);
    await this.userRepo.create(user);
    return user;
  }

  async update(
    id: string,
    params: UserNS.UpdateUserParams
  ): Promise<User> {
    const data = await this.findOne(id);
    data.mtime = Date.now();
    const newUser = { ...data, ...params };
    await this.userRepo.update(newUser);
    return newUser;
  }
}