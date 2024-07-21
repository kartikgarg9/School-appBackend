import express from "express";
import {
  createStudent,
  getStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = express.Router();

router.get("/x", getStudent);
router.post("/new", createStudent);
router.get("/student/:id", getStudents);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
