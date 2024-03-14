import express from "express";
import {
  createTrainer,
  deleteAllTrainers,
  deleteTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
} from "./src/trainers.js";
import { createPath } from "./utils.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();

const STATIC_FILES_PATH = createPath(["public"]);

app.use(cors());

app.use(express.json());

app.use("/home", express.static(STATIC_FILES_PATH));

//1. Get all trainers
app.get("/trainers", async (req, res) => {
  try {
    const trainers = await getAllTrainers();

    return res.json(trainers);
  } catch (error) {
    //.status sets the status code of the response
    return res.status(500).json({ msg: error.message });
  }
});
//2. Create trainer
app.post("/trainers", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      isCurrentlyTeaching,
      timeEmployed,
      coursesFinished,
    } = req.body;

    if (!firstName || !lastName) throw new Error("Invalid Data");

    const newTrainer = await createTrainer(
      firstName,
      lastName,
      email,
      isCurrentlyTeaching,
      timeEmployed,
      coursesFinished
    );

    //201 is status that means something new was created in the backend
    return res.status(201).json(newTrainer);
  } catch (error) {
    console.log(error);
    //400 is bad request
    return res.status(400).json({ msg: error.message });
  }
});
//3. Get trainer by id
// dynamic path parameters are marked with ":" in the url
app.get("/trainers/:id", async (req, res) => {
  try {
    //req.params contains all dynamic path parameters
    const trainerId = req.params.id;

    const foundTrainer = await getTrainerById(trainerId);

    return res.json(foundTrainer);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});
//4. Update trainer
app.patch("/trainers/:id", async (req, res) => {
  try {
    const trainerId = req.params.id;
    const updateData = req.body;

    if (updateData.id) throw new Error("Invalid Data");

    await updateTrainer(trainerId, updateData);

    return res.sendStatus(204);
  } catch (error) {
    //400 is bad request
    return res.status(400).json({ msg: error.message });
  }
});

//6. Delete all trainers
// Delete all is above delete trainer by id because we don't want that endopoint to catch the endpoint url
// /trainers/:id will always catch /trainers/all
app.delete("/trainers/all", async (req, res) => {
  try {
    await deleteAllTrainers();

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

//5. Delete trainer
app.delete("/trainers/:id", async (req, res) => {
  try {
    const trainerId = req.params.id;

    await deleteTrainer(trainerId);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server is up at port ${PORT}`);
});
