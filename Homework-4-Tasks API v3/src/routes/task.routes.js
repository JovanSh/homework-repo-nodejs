import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";

export const taskRouter = Router();

taskRouter.get("/", TaskController.getAllTasks);
taskRouter.get("/:id", TaskController.getTaskById);
taskRouter.post("/", TaskController.createTask);
taskRouter.put("/:id", TaskController.updateTask);
taskRouter.delete("/:id", TaskController.deleteTask);
taskRouter.delete("/", TaskController.deleteAllTasks);
