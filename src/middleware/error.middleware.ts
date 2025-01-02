import { Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction } from "connect";

export const errorMiddleware = async (
  error: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.message = error.message || "Internal Server Error";
  error.statusCode = error.statusCode || 500;

  if (error.message === "jwt expired") {
    error.message = "Please login again.";
    error.statusCode = 401;
  }
    if (error.message === "invalid signature") {
    error.message = "Invalid token.";
    error.statusCode = 400;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.statusCode,
  });
};
