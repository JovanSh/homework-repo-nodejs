import { Router } from "express";
import { taskRouter } from "../routes/task.routes.js";

export const globalRouter = Router();

globalRouter.use("/tasks", taskRouter);
