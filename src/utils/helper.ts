import { NextFunction } from "connect";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const connectToDB = () => mongoose.connect(process.env.MONGO_URI);

export const TryCatch =
  (func: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch();
