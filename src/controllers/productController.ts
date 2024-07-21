import { Request, Response, NextFunction } from "express";
import db from "../config/firebase";
import Product from "../models/productModel";
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

// Create new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body;
    await addDoc(collection(db, "products"), data);
    res.status(200).send("Product created successfully");
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Get all products
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await getDocs(collection(db, "products"));
    const productArray: Product[] = [];

    if (products.empty) {
      res.status(400).send("No products found");
    } else {
      products.forEach((doc) => {
        const data = doc.data();
        const product = new Product(
          doc.id,
          data.name,
          data.price,
          data.retailer,
          data.amountInStock
        );
        productArray.push(product);
      });

      res.status(200).send(productArray);
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Get product by ID
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const productDoc = doc(db, "products", id);
    const data = await getDoc(productDoc);
    if (data.exists()) {
      res.status(200).send(data.data());
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Update product by ID
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const data = req.body;
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, data);
    res.status(200).send("Product updated successfully");
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

// Delete product by ID
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "products", id));
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};
