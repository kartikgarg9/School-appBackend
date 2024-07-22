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
import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const serviceAccount = require("../service-account.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: `https://${config.firebaseConfig.projectId}.firebaseio.com`,
});

const app: Application = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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
      console.error("Error processing document:", error);
      res.status(500).send({ error: (error as Error).message });
    } finally {
      await fs.unlink(filePath); // Clean up the uploaded file
    }
  }
);

const PORT = config.port || 3000;
const HOST_URL = config.hostUrl || "http://localhost";

app.listen(PORT, () => {
  console.log(`Server is live @ ${HOST_URL}:${PORT}`);
});
