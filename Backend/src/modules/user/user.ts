import rand from "../../common/rand";
import { PaginationResponseDto } from "common/dtos/pagination.response";
import { PageOptionsDto } from "common/dtos/page.options";

export namespace UserNS {
  export interface User {
    id: string;
    fullname: string;
    dob: string;
    email: string;
    phone: string;
    gender: Gender;
    username: string;
    password: string;
    ctime: number;
    mtime: number;
  }

  export enum Gender {
    Female,
    Male,
  }

  export interface CreateUserParams {
    fullname: string;
    dob: string;
    email: string;
    phone: string;
    gender: Gender;
    username: string;
    password: string;
  }

  export interface UpdateUserParams {
    fullname?: string;
    dob?: string;
    email?: string;
    phone?: string;
    gender?: Gender;
  }

  export interface Services {
    findAll(query?: PageOptionsDto): Promise<PaginationResponseDto<User>>;
    findOne(id: string): Promise<User>;
    findByUserName(username: string): Promise<User>;
    create(params: CreateUserParams): Promise<User>;
    update(id: string, params: UpdateUserParams): Promise<User>;
  }

  export interface Repository {
    findAll(query?: PageOptionsDto): Promise<PaginationResponseDto<User>>;
    findOne(id: string): Promise<User>;
    findByUserName(username: string): Promise<User>;
    create(user: User): Promise<void>;
    update(user: User): Promise<void>;
  }

  export const Errors = {
    NotFound: new Error("user not found"),
    Existed: new Error("user existed"),
  };

  export const Generators = {
    NewUserId: (l = 8): string => rand.number(l),
  };
}