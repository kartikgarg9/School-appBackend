import { Request, Response } from "express";
import db from "../config/firebase"; // Ensure to import db correctly from your firebase setup
import Homework from "../models/homeworkModel";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore/lite";

// Create a new homework assignment
export const createHomework = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const homework = new Homework(
      data.id,
      data.title,
      data.description,
      new Date(data.dueDate),
      data.subject,
      data.assignedBy,
      data.status
    );
    await addDoc(
      collection(db, "homework"),
      JSON.parse(JSON.stringify(homework)) // Ensure Homework class is serializable
    );
    res.status(201).send("Homework created successfully");
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Get all homework assignments
export const getHomeworks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const homeworks = await getDocs(collection(db, "homework"));
    const homeworkArray: Homework[] = [];

    if (homeworks.empty) {
      res.status(400).send("No homework assignments found");
    } else {
      homeworks.forEach((doc) => {
        const homeworkData = doc.data();
        const homework = new Homework(
          doc.id,
          homeworkData.title,
          homeworkData.description,
          new Date(homeworkData.dueDate),
          homeworkData.subject,
          homeworkData.assignedBy,
          homeworkData.status
        );
        homeworkArray.push(homework);
      });

      res.status(200).send(homeworkArray);
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Get homework assignment by ID
export const getHomework = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const homeworkDoc = doc(db, "homework", id);
    const data = await getDoc(homeworkDoc);
    if (data.exists()) {
      res.status(200).send(data.data());
    } else {
      res.status(404).send("Homework not found");
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Update homework assignment by ID
export const updateHomework = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const data = req.body;
    const homeworkDoc = doc(db, "homework", id);
    await updateDoc(homeworkDoc, data);
    res.status(200).send("Homework updated successfully");
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Delete homework assignment by ID
export const deleteHomework = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "homework", id));
    res.status(200).send("Homework deleted successfully");
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};
