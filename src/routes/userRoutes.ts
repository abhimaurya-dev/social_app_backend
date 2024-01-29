import express from "express";
import { loginController } from "../controllers/userControllers/loginController";
import { signInController } from "../controllers/userControllers/signInController";

const router = express.Router();

router.post("/login", loginController);
router.post("/signIn", signInController);

export default router;
