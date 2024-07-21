import express, { Application, Request, Response } from "express";
import cors from "cors";
import productRoute from "./routes/productRoute";
import homeworkRoute from "./routes/homeworkRoute";
import teacherRoute from "./routes/teacherRoute";
import studentRoute from "./routes/studentRoute";
import config from "./config";
import multer from "multer";
import { promises as fs } from "fs";
import { quickstart } from "./processDocument";

const app: Application = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", productRoute);
app.use("/work", homeworkRoute);
app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);

app.post(
  "/process-document",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    try {
      const fullText = await quickstart(filePath);
      res.send({ fullText });
    } catch (error) {
      res.status(500).send({ error: (error as Error).message });
    } finally {
      await fs.unlink(filePath); // Clean up the uploaded file
    }
  }
);

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`)
);
