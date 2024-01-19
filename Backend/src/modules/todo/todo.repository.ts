import { Db } from "mongodb";
import { TodoNS } from "./todo";
import {
  FromMongoData,
  MongoErrorCodes,
  MongoModel,
  ToMongoData,
} from "../../database/mongo";
type Todo = TodoNS.Todo;

export class TodoRepository implements TodoNS.Repository {
  constructor(private db: Db) {}

  private col_todo = this.db.collection<MongoModel<TodoNS.Todo>>("todo");

  async init() {}

  async findAll(): Promise<Todo[]> {
    const docs = await this.col_todo.find().toArray();
    return FromMongoData.Many(docs);
  }

  async findOne(id: string): Promise<Todo> {
    const doc = await this.col_todo.findOne({ _id: id });
    return FromMongoData.One(doc);
  }

  async create(todo: Todo): Promise<void> {
    try {
      const doc = ToMongoData.One(todo);
      await this.col_todo.insertOne(doc);
    } catch (e) {
      if (e.code === MongoErrorCodes.Duplicate) {
        throw TodoNS.Errors.Existed;
      }
      throw e;
    }
  }

  async update(todo: Todo): Promise<void> {
    try {
      const doc = ToMongoData.One(todo);
      await this.col_todo.updateOne({ _id: todo.id }, { $set: doc });
    } catch (e) {
      throw e;
    }
  }
}