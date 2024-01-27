import { Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = (
  req: Request,
  res: Response,
  error: any,
  next: NextFunction
) => {
  const message: string = error.message || "Internal Server Error";
  const statusCode: number = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
  next();
};
