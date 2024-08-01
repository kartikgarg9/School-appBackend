import { Request } from "express";
import { UserInfo } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      file?: {
        path: string;
        filename: string;
        mimetype: string;
      };
      user?: UserInfo;
    }
  }
}
