import { Router } from "express";
import { getAllStudents, getStudentById } from "./students.js";

export const studentsRouter = Router();

//1. Get all students
studentsRouter.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const students = await getAllStudents(filters);

    if (req.query.sortBy === "age") {
      students.sort((a, b) => a.age - b.age);
    }

    console.log(filters);

    return res.json(students);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: error.message });
  }
});

//2. Get student by id
studentsRouter.get("/:id", async (req, res) => {
  try {
    const filters = req.query;
    const students = await getStudentById(filters);

    console.log(filters);

    return res.json(students);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});
