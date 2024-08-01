// // src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization)
    return res.status(401).send({ message: "No token provided" });
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    console.error(
      "Could not find the token after Bearer word. Possibly Bearer is missing in the token"
    );
    return res.status(401).send({ message: "Invalid Token!" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({ message: "Invalid token" });
  }
};
