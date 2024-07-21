import express, { Request, Response } from "express";
import {
  createHomework,
  getHomework,
  getHomeworks,
  updateHomework,
  deleteHomework,
} from "../controllers/homeworkController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => getHomeworks(req, res));
router.post("/new", (req: Request, res: Response) => createHomework(req, res));
router.get("/homework/:id", (req: Request, res: Response) =>
  getHomework(req, res)
);
router.put("/update/:id", (req: Request, res: Response) =>
  updateHomework(req, res)
);
router.delete("/delete/:id", (req: Request, res: Response) =>
  deleteHomework(req, res)
);

export default router;
