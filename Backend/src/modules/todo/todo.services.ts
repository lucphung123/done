import { UserServices } from "modules/user/user.services";
import { TodoNS } from "./todo";
import { TodoRepository } from "./todo.repository";

type Todo = TodoNS.Todo;
export class TodoServices implements TodoNS.Services {
  constructor(
    private todoRepo: TodoRepository,
  ) {}

  async findAll(): Promise<Todo[]> {
    const todos = await this.todoRepo.findAll();
    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepo.findOne(id);
    if (!todo) throw TodoNS.Errors.NotFound;
    return todo;
  }

  async create(params: TodoNS.CreateTodoParams): Promise<Todo> {
    const todo: Todo = {
      id: TodoNS.Generators.NewTodoId(),
      ...params,
      updated_at: Date.now(),
    };
    await this.todoRepo.create(todo);
    return todo;
  }

  async update(id: string, params: TodoNS.UpdateTodoParams): Promise<Todo> {
    const todo = await this.findOne(id);
    todo.updated_at = Date.now();
    const newTodo = { ...todo, ...params };
    await this.todoRepo.update(newTodo);
    return newTodo;
  }
}