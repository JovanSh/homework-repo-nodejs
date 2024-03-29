import express from "express";
import { studentsRouter } from "./src/students.routes.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the students api</h1>");
});

app.use("/students", studentsRouter);

app.listen(PORT, HOST, () => {
  console.log(`Server is up at port: ${PORT}`);
});
