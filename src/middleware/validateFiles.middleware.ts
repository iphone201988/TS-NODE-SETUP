import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ErrorHandler from "../utils/ErrorHandler.js";

export const validateFiles = (requiredFiles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Single file uploaded
    if (req.file && req.file?.fieldname != requiredFiles[0])
      return next(
        new ErrorHandler(
          `${requiredFiles[0]} is required`,
          httpStatus.BAD_REQUEST
        )
      );

    // Multiple files uploaded
    requiredFiles.forEach((fileKey: string) => {
      if (!req.files[fileKey])
        return next(
          new ErrorHandler(`${fileKey} is required`, httpStatus.BAD_REQUEST)
        );
    });

    next();
  };
};

export default validateFiles;
