import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore/lite";
import config from "../config";

// Define the shape of the Firebase configuration
interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
  [key: string]: any; // For additional properties if needed
}

// Initialize Firebase with the configuration
const firebaseConfig: FirebaseConfig = {
  ...config.firebaseConfig,
  // Firebase Admin SDK needs to be initialized separately,
  // the cert function is used for this purpose in the server context.
  // You might not need it in the client-side Firebase configuration.
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export default db;
