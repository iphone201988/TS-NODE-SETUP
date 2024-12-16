import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { TryCatch } from "../utils/helper.js";
import User from "../model/user.model.js";

export const authenticationMiddleware = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return next(
        new ErrorHandler(
          "Please login to access the route",
          httpStatus.UNAUTHORIZED
        )
      );

    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decode)
      return next(new ErrorHandler("Invalid token", httpStatus.UNAUTHORIZED));

    const user = await User.findById(decode.id);

    if (!user)
      return next(new ErrorHandler("User not found", httpStatus.BAD_REQUEST));

    if (decode.jti !== user.jti)
      return next(new ErrorHandler("Unauthorized", httpStatus.UNAUTHORIZED));

    req.userId = user._id.toString();
    next();
  }
);
