import mongoose from "mongoose";
import logger from "../utils/logger";

export const dbConnect = () => {
  const DB_URI: string | undefined = process.env.MONGO_DB_URI as string;
  if (!DB_URI) {
    return console.log("DB_URI is not available");
  }
  mongoose
    .connect(DB_URI)
    .then(() => {
      logger.info("DB is connected");
    })
    .catch((e) => {
      logger.error(e);
    });
};
