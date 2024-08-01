import { Request, Response } from "express";
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
import db from "../config/firebase"; // Ensure this path is correct
import Student from "./models/studentModel";

// Create a new student
export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const student = new Student(
      data.id,
      data.name,
      data.age,
      data.grade,
      data.email,
      data.enrolledCourses
    );
    await addDoc(
      collection(db, "students"),
      JSON.parse(JSON.stringify(student))
    );
    res.status(201).send("Student created successfully");
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Get all students
export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentsSnapshot = await getDocs(collection(db, "students"));
    const studentArray: Student[] = [];

    if (studentsSnapshot.empty) {
      res.status(400).send("No students found");
    } else {
      studentsSnapshot.forEach((doc) => {
        const studentData = doc.data();
        const student = new Student(
          doc.id,
          studentData.name,
          studentData.age,
          studentData.grade,
          studentData.email,
          studentData.enrolledCourses
        );
        studentArray.push(student);
      });
      res.status(200).send(studentArray);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Get student by ID
export const getStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const studentDoc = doc(db, "students", id);
    const docSnapshot = await getDoc(studentDoc);

    if (docSnapshot.exists()) {
      res.status(200).send(docSnapshot.data());
    } else {
      res.status(404).send("Student not found");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Update student by ID
export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const data = req.body;
    const studentDoc = doc(db, "students", id);
    await updateDoc(studentDoc, data);
    res.status(200).send("Student updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

// Delete student by ID
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "students", id));
    res.status(200).send("Student deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};
