import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { dbConnect } from "./config/dbConfig";

import userRoutes from "./routes/userRoutes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler/errorHandlerMiddleware";
import cookieParser from "cookie-parser";

const app: express.Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors<Request>());

dotenv.config({ path: "src/config.env" });

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Social Server",
  });
});

app.use("/api/v1/", userRoutes);

// middlewares

app.use((err: any, req: Request, res: Response, next: NextFunction) =>
  errorHandlerMiddleware(req, res, err, next)
);

app.listen(process.env.PORT, () => {
  dbConnect();
  console.log(`Server is Running on Port ${process.env.PORT}`);
});
