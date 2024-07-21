import express from "express";
import {
  createTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController";

const router = express.Router();

router.get("/", getTeachers);
router.post("/new", createTeacher);
router.get("/teacher/:id", getTeacher);
router.put("/update/:id", updateTeacher);
router.delete("/delete/:id", deleteTeacher);

export default router;
