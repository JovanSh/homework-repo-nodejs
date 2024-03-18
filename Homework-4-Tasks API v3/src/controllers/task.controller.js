import { TaskModel } from "../models/task.model.js";

export class TaskController {
  //1. Get all tasks
  static async getAllTasks(req, res) {
    try {
      const tasks = await TaskModel.getAllTasks();

      return res.json(tasks);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  //2. Get task by id
  static async getTaskById(req, res) {
    try {
      const { id: taskId } = req.params;

      const foundTask = await TaskModel.getTaskById(taskId);

      return res.json(foundTask);
    } catch (error) {
      return res.status(404).json({ msg: error.message });
    }
  }

  //3. Create task
  static async createTask(req, res) {
    try {
      const taskData = req.body;

      const newTask = await TaskModel.createTask(taskData);

      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }

  //4. Update task
  static async updateTask(req, res) {
    try {
      const updateData = req.body;
      const taskId = req.params.id;

      const updatedTask = await TaskModel.updateTask(taskId, updateData);

      return res.json(updatedTask);
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
  //5. Delete task
  static async deleteTask(req, res) {
    try {
      await TaskModel.deleteTask(req.params.id);

      return res.sendStatus(204);
    } catch (error) {
      return res.status(404).json({ msg: error.message });
    }
  }

  //6. Delete all tasks
  static async deleteAllTasks(req, res) {
    try {
      await TaskModel.deleteAllTasks();

      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}
