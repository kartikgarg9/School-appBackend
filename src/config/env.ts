import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface Env {
  GOOGLE_API_KEY: string;
  [key: string]: string | undefined;
}

const env: Env = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
};

if (!env.GOOGLE_API_KEY) {
  throw new Error(
    "GOOGLE_API_KEY is not defined in the environment variables."
  );
}

export default env;
