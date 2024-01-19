import rand from "../../common/rand";

export namespace TodoNS {
  export interface Todo {
    id: string;
    name: string;
    deadline: string;
    priority: number;
    status: number;
    updated_at: number;
  }

  export interface CreateTodoParams {
    name: string;
    deadline: string;
    priority: number;
    status: number;
  }

  export enum Status {
    New = 1,
    Pending,
    Done,
  }

  export interface UpdateTodoParams {
    name?: string;
    deadline?: string;
    priority?: number;
    status?: number;
  }

  export interface Services {
    findAll(): Promise<Todo[]>;
    findOne(id: string): Promise<Todo>;
    create(params: CreateTodoParams): Promise<Todo>;
    update(id: string, params: UpdateTodoParams): Promise<Todo>;
  }

  export interface Repository {
    findAll(): Promise<Todo[]>;
    findOne(id: string): Promise<Todo>;
    create(todo: Todo): Promise<void>;
    update(todo: Todo): Promise<void>;
  }

  export const Errors = {
    NotFound: new Error("todo not found"),
    Existed: new Error("todo existed"),
  };

  export const Generators = {
    NewTodoId: (l = 8): string => rand.uppercase(l),
  };
}