import mongoose from "mongoose";
import logger from "../utils/logger";
import ErrorHandler from "../utils/ErrorHandler";

export const dbConnect = () => {
  const DB_URI: string | undefined = process.env.MONGO_DB_URI;
  if (!DB_URI) {
    return console.log("DB_URI is not available");
  }
  mongoose
    .connect(DB_URI)
    .then(() => {
      logger.info("DB is connected");
    })
    .catch((e) => {
      console.log(e);
      return new ErrorHandler("DB not connected", 500);
    });
};
