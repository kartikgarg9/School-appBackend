import express, { Request, Response } from "express";
import multer from "multer";
import { promises as fs } from "fs";
import {
  extractTextFromDocumentUsingDocumentAI,
  savedDocumentId as saveDocument,
} from "../controllers/processDocument";
import {
  collectionGroup,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore/lite";
import db from "../config/firebase";
import { calculateFileHash } from "../utils/calculateHash";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file || !req.body.question) {
    return res.status(400).send({ error: "File and question are required" });
  }
  let documentId;
  const filePath = req.file.path;
  // check if the hash exists in any of the documents (document sub-collectoin)

  // if it exists, get document and in answer question use the savedDocumentID
  // else save the new document
  try {
    console.debug(filePath);
    const hash: string = (await calculateFileHash(filePath)) as string;
    if (!hash) throw new Error("There was an issue in processing the file");
    let fullText = "";
    const queryDoc = query(
      collectionGroup(db, "documents"),
      where("hash", "==", hash),
      limit(1)
    );
    const doc = await getDocs(queryDoc);
    if (doc.docs?.[0]?.exists()) {
      documentId = doc.docs?.[0].id;
    } else {
      // create doc and get text

      fullText = await extractTextFromDocumentUsingDocumentAI(filePath);
      // TODO create doc function here

      documentId = saveDocument({
        extractedText: fullText,
        uid: req.user!.uid,
        hash,
        createdAt: new Date(),
      });
    }

    // save the document here and send in response the document id

    res.send(documentId);
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).send({ error: (error as Error).message });
  } finally {
    await fs.unlink(filePath); // Clean up the uploaded file
  }
});

export default router;
