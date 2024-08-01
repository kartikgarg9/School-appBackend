// src/routes/auth.ts

import { Router } from "express";
import admin from "firebase-admin";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import db from "../config/firebase"; // Ensure correct import

const router = Router();

router.post("/", async (req, res) => {
  const { token, user } = req.body;

  try {
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Reference to the userInformation subcollection
    const userInfoCollectionRef = doc(db, `users`, decodedToken.uid);

    // Add a document to the subcollection with an auto-generated ID
    const docRef = await setDoc(userInfoCollectionRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date(),
    });

    res
      .status(200)
      .send({
        message: "User authenticated and saved",
        docId: decodedToken.uid,
      }); // Returning the auto-generated document ID
  } catch (error) {
    console.error("Error verifying token or saving user:", error);
    res.status(500).send({ message: "Authentication failed" });
  }
});

export default router;
