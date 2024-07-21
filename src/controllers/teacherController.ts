import { Request, Response } from "express";
import db from "../config/firebase"; // Ensure this path is correct
import Teacher from "../models/teacherModel";
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

// Create a new teacher
export const createTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const teacher = new Teacher(
      data.id,
      data.name,
      data.age,
      data.subject,
      data.email,
      data.yearsOfExperience,
      data.sectionAssigned
    );
    await addDoc(
      collection(db, "teachers"),
      JSON.parse(JSON.stringify(teacher))
    );
    res.status(201).send("Teacher created successfully");
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Get all teachers
export const getTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teachersSnapshot = await getDocs(collection(db, "teachers"));
    const teacherArray: Teacher[] = [];

    if (teachersSnapshot.empty) {
      res.status(400).send("No teachers found");
    } else {
      teachersSnapshot.forEach((doc) => {
        const teacherData = doc.data();
        const teacher = new Teacher(
          doc.id,
          teacherData.name,
          teacherData.age,
          teacherData.subject,
          teacherData.email,
          teacherData.yearsOfExperience,
          teacherData.sectionAssigned
        );
        teacherArray.push(teacher);
      });

      res.status(200).send(teacherArray);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Get teacher by ID
export const getTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const teacherDoc = doc(db, "teachers", id);
    const docSnapshot = await getDoc(teacherDoc);

    if (docSnapshot.exists()) {
      res.status(200).send(docSnapshot.data());
    } else {
      res.status(404).send("Teacher not found");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Update teacher by ID
export const updateTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const data = req.body;
    const teacherDoc = doc(db, "teachers", id);
    await updateDoc(teacherDoc, data);
    res.status(200).send("Teacher updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Delete teacher by ID
export const deleteTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "teachers", id));
    res.status(200).send("Teacher deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};
