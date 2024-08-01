import express, { Request, Response } from "express";
import multer from "multer";
import { answerQuestion } from "../controllers/chatController";
import { extractTextFromDocumentUsingDocumentAI } from "../controllers/processDocument";
import { calculateFileHash } from "../utils/calculateHash";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore/lite";
import db from "../config/firebase";
import { DocumentData } from "../controllers/models/Document";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", async (req: Request, res: Response) => {
  // TODO get document from document id

  const documentId = req.body.documentId;
  const documentRef = doc((collectionGroup(db, "documents"), documentId));
  const document = await getDoc(documentRef);
  const documentData: DocumentData = document.data() as DocumentData;

  // Answer the question
  const answer = await answerQuestion(
    req.body.question,
    documentData?.extractedText
  );

  // save the answer to the document

  res.send({ answer });
});

export default router;
