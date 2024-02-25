import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { dbConnect } from "./config/dbConfig";

import userRoutes from "./routes/userRoutes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler/errorHandlerMiddleware";
import cookieParser from "cookie-parser";

const app: express.Application = express();

const corsOptions = {
  origin: ["https://socialappfrontend.vercel.app", "http://localhost:5173"],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://socialappfrontend.vercel.app"
  ); // Adjust the origin accordingly
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Access-Control-Allow-Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());

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

app.listen(process.env.PORT || 8000, () => {
  dbConnect();
  console.log(`Server is Running on Port ${process.env.PORT || 8000}`);
});

export default app;
