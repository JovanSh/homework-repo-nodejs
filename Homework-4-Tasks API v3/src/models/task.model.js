import { DataService } from "../services/data.service.js";
import { createPath } from "../../utils.js";
import { v4 as uuid } from "uuid";
import Joi from "joi";

const TASKS_PATH = createPath(["data", "tasks.json"]);

class Task {
  id = uuid();
  isFinished = false;

  constructor(text, author) {
    this.text = text;
    this.author = author;
  }
}

const taskSchema = Joi.object({
  text: Joi.string().min(2).required(),
  author: Joi.string().min(2).required(),
});

//Models are in charge of doing crud operations with the database ( tasks.json )
export class TaskModel {
  //Save tasks
  static async saveTasks(tasks) {
    await DataService.saveJSONFile(TASKS_PATH, tasks);
  }

  //1. Get all tasks
  static async getAllTasks() {
    const tasks = await DataService.readJSONFile(TASKS_PATH);

    return tasks;

    //One liner solution to above code
    // return DataService.readJSONFile(TASKS_PATH)
  }

  //2. Get task by id
  static async getTaskById(taskId) {
    const tasks = await this.getAllTasks();

    const foundTask = tasks.find((task) => task.id === taskId);

    if (!foundTask) throw new Error("Task not found");

    return foundTask;
  }

  //3. Create task
  static async createTask(taskData) {
    const tasks = await this.getAllTasks();

    const validation = taskSchema.validate(taskData);

    if (validation?.error) throw new Error(validation.error.details[0].message);

    const { text, author } = taskData;

    const newTask = new Task(text, author);

    const updatedTasks = [...tasks, newTask];

    await this.saveTasks(updatedTasks);

    return newTask;
  }

  //4. Update task
  static async updateTask(taskId, updateData) {
    if (updateData.id) throw new Error("Can't update task! Invalid request");

    const tasks = await this.getAllTasks();

    const taskExists = tasks.some((task) => task.id === taskId);

    if (!taskExists) throw new Error("Can't update task! Task not found!");

    let updatedTask = null;

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        updatedTask = { ...task, ...updateData };

        return updatedTask;
      } else {
        return task;
      }
    });

    await this.saveTasks(updatedTasks);

    return updatedTask;
  }

  //5 Delete task
  static async deleteTask(taskId) {
    const tasks = await this.getAllTasks();

    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    if (tasks.length === updatedTasks.length)
      throw new Error("Can't delete task! Task not found!");

    await this.saveTasks(updatedTasks);
  }
  //6 Delete all tasks
  static async deleteAllTasks() {
    await this.saveTasks([]);
  }
}
