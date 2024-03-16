import { DataService } from "./data.service.js";
import { createPath } from "../utils.js";

const STUDENTS_PATH = createPath(["data", "students.json"]);

//1. Get all students
export const getAllStudents = async (filters) => {
  let students = await DataService.readJSONFile(STUDENTS_PATH);

  if (filters?.gender) {
    students = students.filter((student) => student.gender === filters.gender);
  }

  return students;
};

//2. Get student by id
export const getStudentById = async (filters) => {
  let students = await DataService.readJSONFile(STUDENTS_PATH);

  if (filters?.id) {
    students = students.filter((student) => student.id === filters.id);
  }

  return students;
};
