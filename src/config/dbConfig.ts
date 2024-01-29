import mongoose from "mongoose";

export const dbConnect = () => {
  const DB_URI: string | undefined = process.env.MONGO_DB_URI;
  if (!DB_URI) {
    return console.log("DB_URI is not available");
  }
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("DB is connected");
    })
    .catch((e) => {
      console.log(e);
    });
};
