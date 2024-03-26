import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

import { dbConnect } from "./config/dbConfig";
import UserModel from "./models/userModel";

import userRoutes from "./routes/userRoutes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler/errorHandlerMiddleware";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";

const app: express.Application = express();

app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());
const corsOptions: CorsOptions = {
  origin: [
    "https://socialappfrontend.vercel.app",
    "https://www.socialappfrontend.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
  allowedHeaders: ["*"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

dotenv.config({ path: "src/config.env" });

// DB Connection

app.get("/", async (req: Request, res: Response) => {
  const user = await UserModel.find();
  res.status(200).json({
    user,
    success: true,
    message: "Welcome to Social Server",
  });
});

app.use("/api/v1/", userRoutes);

// middlewares

app.use((err: any, req: Request, res: Response, next: NextFunction) =>
  errorHandlerMiddleware(req, res, err, next)
);

app.listen(process.env.PORT || 8000, () => {
  dbConnect();
  logger.info(`Server is Running on Port ${process.env.PORT || 8000}`);
});

export default app;
