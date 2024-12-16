import { Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import { NextFunction } from "connect";
import httpStatus from "http-status";

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
    error.statusCode = httpStatus.UNAUTHORIZED;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.statusCode,
  });
};
