import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const connectToDB = () => mongoose.connect(process.env.MONGO_URI);

export const TryCatch =
  (func: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch();

export const generateJwtToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const sendEmail = async (
  email: string,
  subject: string,
  text: string,
  html: string
) => {
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject,
    text,
    html,
  };

  transport.sendMail(mailOptions, function (err: any, info: any) {
    if (err) {
      console.log(err);
    } else {
      // console.log(info);
    }
  });
};

export const getImages = (req: Request, fileNames: Array<string>) => {
  // Single file uploaded
  if (fileNames.length == 1 && req.file) {
    return {
      [fileNames[0]]: process.env.BACKEND_URL + "/uploads/" + req.file.filename,
    };
  }

  // Multiple files uploaded
  const files: any = {};
  fileNames.forEach((fileKey: string) => {
    if (req.files && req.files[fileKey]) {
      files[fileKey] = req.files[fileKey].map(
        (file: any) => process.env.BACKEND_URL + "/uploads/" + file.filename
      );
    }
  });
  if (Object.keys(files).length) return files;

  return null;
};
