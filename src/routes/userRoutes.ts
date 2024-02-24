import express from "express";
import { loginController } from "../controllers/userControllers/loginController";
import { signInController } from "../controllers/userControllers/signInController";
import { logoutController } from "../controllers/userControllers/logoutController";
import { refreshTokenController } from "../controllers/userControllers/refreshTokenController";

const router = express.Router();

router.post("/login", loginController);
router.post("/signIn", signInController);
router.post("/logout", logoutController);
router.post("/refreshAuthToken", refreshTokenController);

export default router;
