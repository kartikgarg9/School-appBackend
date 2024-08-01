import express from "express";
import {
  createStudent,
  getStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = express.Router();

router.get("/:id", getStudent);
router.post("/new", createStudent);
router.get("/", getStudents);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
