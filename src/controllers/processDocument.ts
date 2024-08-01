import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { promises as fs } from "fs";

import { addDoc, collection } from "firebase/firestore/lite";
import creds from "../../service-accountpro.json";
import { DocumentData } from ".././controllers/models/Document";
import db from "../config/firebase";

const projectId: string = "582710327787";
const location: string = "us";
const processorId: string = "f676c3413c749a21";

interface TextAnchor {
  textSegments: Array<{
    startIndex?: number;
    endIndex: number;
  }>;
}

interface Paragraph {
  layout: {
    textAnchor: TextAnchor;
  };
}

interface Page {
  paragraphs: Paragraph[];
}

interface Document {
  text: string;
  pages: Page[];
}

const client = new DocumentProcessorServiceClient({
  apiEndpoint: "us-documentai.googleapis.com",
  credentials: creds,
});

export async function extractTextFromDocumentUsingDocumentAI(
  filePath: string
): Promise<string> {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const imageFile = await fs.readFile(filePath);
  const encodedImage = Buffer.from(imageFile).toString("base64");

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: "image/png",
    },
  };

  try {
    const [result] = await client.processDocument(request);
    const document = result.document as Document;

    const text = document.text || "";

    const getText = (textAnchor: TextAnchor): string => {
      if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
        return "";
      }

      return textAnchor.textSegments
        .map((segment) => {
          const startIndex = segment.startIndex || 0;
          const endIndex = segment.endIndex;
          return text.substring(startIndex, endIndex);
        })
        .join("");
    };

    const [page1] = document.pages || [];
    const paragraphs = page1.paragraphs || [];

    let fullText = "";

    for (const paragraph of paragraphs) {
      const paragraphText = getText(paragraph.layout.textAnchor);
      const formattedText = paragraphText.replace(/\n+/g, "\n").trim();
      fullText += `${formattedText}\n\n`;
    }

    return fullText;
  } catch (error) {
    console.error(`Error processing document: ${(error as Error).message}`);
    throw error;
  }
}

export async function savedDocumentId(payload: DocumentData): Promise<string> {
  // Create a reference to the 'documents' subcollection
  const collectionRef = collection(db, `users/${payload.uid}/documents`);

  // Save document data
  const docRef = await addDoc(collectionRef, {
    ...payload,
  });

  console.log(`Document stored with ID: ${docRef.id}`);

  return docRef.id;
}
