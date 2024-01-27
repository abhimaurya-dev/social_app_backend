import express, { Request, Response } from "express";
import dotenv from "dotenv";

const app: express.Application = express();

dotenv.config({ path: "src/config.env" });

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Social Server",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on Port ${process.env.PORT}`);
});
