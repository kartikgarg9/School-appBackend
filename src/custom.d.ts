import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      file?: {
        path: string;
        filename: string;
        mimetype: string;
      };
    }
  }
}
