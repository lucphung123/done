import { Router } from "express";
import { TodoServices } from "./todo.services";
import { HttpParamValidators } from "../../lib/http";
import { TodoNS } from "./todo";

export function TodoController(todoServices: TodoServices) {
  const router = Router();

  const status = Object.values(TodoNS.Status).filter(v => !isNaN(Number(v))) as number[];

  router.get("/", async (req, res) => {
    const todos = await todoServices.findAll();
    res.json(todos);
  });

  router.get("/:id", async (req, res) => {
    const id = HttpParamValidators.MustBeString(req.params, "id", 2);
    const todo = await todoServices.findOne(id);
    res.json(todo);
  });

  router.post("/", async (req, res) => {
    const params: TodoNS.CreateTodoParams = {
      name: HttpParamValidators.MustBeString(req.body, "name", 2),
      deadline: HttpParamValidators.MustBeString(req.body, "deadline", 2),
      priority: req.body.priority,
      status: HttpParamValidators.MustBeOneOf(req.body, "status", status),
    };
    const todo = await todoServices.create(params);
    res.json(todo);
  });

  router.put("/:id", async (req, res) => {
    const id = HttpParamValidators.MustBeString(req.params, "id", 2);
    const keys = Object.keys(req.body);
    if (keys.length !== +0) {
      keys.forEach((k: string) => {
        switch (k) {
          case "name":
            HttpParamValidators.MustBeString(req.body, "name", 2);
            break;
          case "deadline":
            HttpParamValidators.MustBeString(req.body, "deadline", 2);
            break;
          case "status":
            HttpParamValidators.MustBeOneOf(req.body, "status", status);
            break;
          default:
            break;
        }
      });
    }
    const todo = await todoServices.update(id, req.body);
    res.json(todo);
  });

  return router;
}