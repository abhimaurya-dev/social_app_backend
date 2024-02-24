"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginController_1 = require("../controllers/userControllers/loginController");
const signInController_1 = require("../controllers/userControllers/signInController");
const logoutController_1 = require("../controllers/userControllers/logoutController");
const refreshTokenController_1 = require("../controllers/userControllers/refreshTokenController");
const router = express_1.default.Router();
router.post("/login", loginController_1.loginController);
router.post("/signIn", signInController_1.signInController);
router.post("/logout", logoutController_1.logoutController);
router.post("/refreshAuthToken", refreshTokenController_1.refreshTokenController);
exports.default = router;
