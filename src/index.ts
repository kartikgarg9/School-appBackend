import express, { Application } from "express";
import cors from "cors";
import productRoute from "./routes/productRoute";
import homeworkRoute from "./routes/homeworkRoute";
import teacherRoute from "./routes/teacherRoute";
import studentRoute from "./routes/studentRoute";
import generateContentRoute from "./routes/generateContentRoute";
import config from "./config";
import multer from "multer";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { onRequest } from "firebase-functions/v2/https";
import chatRoute from "./routes/chatRoute";
import processDocument from "./routes/processDocument";
import { authenticate } from "./middleware/auth";
import bodyParser from "body-parser";
import auth from "./routes/auth";
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
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/api", productRoute);
app.use("/work", homeworkRoute);
app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);
app.use("/api/authenticate", auth);

// // Token verification endpoint
// app.post("/api/authenticate", async (req, res) => {
//   const { token } = req.body;

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     res.status(200).send({ message: "Token is valid", decodedToken });
//   } catch (error) {
//     res.status(401).send({ message: "Invalid token", error });
//   }
// });

// Apply authentication middleware to protected routes
app.use("/api/generate-content", authenticate, generateContentRoute);
app.use("/api/chat", authenticate, chatRoute);
app.use("/api/process-document", authenticate, processDocument);

const PORT = config.port || 3000;
const HOST_URL = config.hostUrl || "http://localhost";

app.listen(PORT, () => {
  console.log(`Server is live @ ${HOST_URL}:${PORT}`);
});

exports.api = onRequest(app);
