import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler/errorHandlerMiddleware";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";

import { dbConnect } from "./config/dbConfig";

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
  allowedHeaders: ["Content-type", "Accept", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

dotenv.config({ path: "src/config.env" });

dbConnect();

// const DB_URI: string | undefined = process.env.MONGO_DB_URI as string;
// mongoose
//   .connect(DB_URI)
//   .then(() => {
//     logger.info("DB is connected");
//   })
//   .catch((e) => {
//     logger.error(e);
//   });

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
  logger.info(`Server is Running on Port ${process.env.PORT || 8000}`);
});

export default app;
