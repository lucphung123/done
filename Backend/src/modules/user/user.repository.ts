import { Db } from "mongodb";
import { UserNS } from "./user";
import {
  FromMongoData,
  MongoErrorCodes,
  MongoModel,
  ToMongoData,
} from "../../database/mongo";
import { PaginationResponseDto } from "common/dtos/pagination.response";
import { PageOptionsDto } from "common/dtos/page.options";

type User = UserNS.User;

export class UserRepository implements UserNS.Repository {
  constructor(private db: Db) {}

  private col_user = this.db.collection<MongoModel<UserNS.User>>("user");

  async init() {
    this.col_user.createIndex("username", {
      unique: true,
      background: true,
    });

    this.col_user.createIndex("email", {
      unique: true,
      background: true,
    });

    this.col_user.createIndex("phone", {
      unique: true,
      background: true,
    });
  }

  async findAll(query: PageOptionsDto): Promise<PaginationResponseDto<User>> {
    const { page, limit } = query;
    const docs = await this.col_user["paginate"](page, limit);
    return docs;
  }

  async findOne(id: string): Promise<User> {
    const doc = await this.col_user.findOne({ _id: id });
    delete doc.password;
    return FromMongoData.One(doc);
  }

  async findByUserName(username: string): Promise<UserNS.User> {
    const doc = await this.col_user.findOne({ username });
    return FromMongoData.One(doc);
  }

  async create(user: User): Promise<void> {
    try {
      const doc = ToMongoData.One(user);
      await this.col_user.insertOne(doc);
    } catch (e) {
      if (e.code === MongoErrorCodes.Duplicate) {
        throw UserNS.Errors.Existed;
      }
      throw e;
    }
  }

  async update(user: User): Promise<void> {
    try {
      const doc = ToMongoData.One(user);
      await this.col_user.updateOne({ _id: user.id }, { $set: doc });
    } catch (e) {
      throw e;
    }
  }
}