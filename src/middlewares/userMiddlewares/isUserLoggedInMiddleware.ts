import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../../utils/ErrorHandler";

export const isUserloggedInMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const userAuthToken = req.headers.authorization.slice(
        7,
        req.headers.authorization.length
      );
      if (!userAuthToken) {
        return next(new ErrorHandler("Unauthorized access", 401));
      }
      if (process.env.JWT_ACCESS_TOKEN_SECRET) {
        const userPayload = jwt.verify(
          userAuthToken,
          process.env.JWT_ACCESS_TOKEN_SECRET
        );
        req.body.userId = userPayload;
      }
    } else {
      return next(new ErrorHandler("Unauthorized access", 401));
    }
    next();
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Internal server error", 500));
  }
};
