"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userLoginModel_1 = __importDefault(require("../../models/userLoginModel"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return next(new ErrorHandler_1.default("Invalid email or password", 401));
    }
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userLogin = yield userLoginModel_1.default.findOne({ email }).select("+password");
        const user = yield userModel_1.default.findOne({ email });
        if (!userLogin) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, userLogin.password);
        if (!isPasswordValid) {
            console.log("not valid");
            return next(new ErrorHandler_1.default("Invalid email or password", 401));
        }
        const userInstance = new userLoginModel_1.default(userLogin);
        const tokens = yield userInstance.generateAuthToken();
        res.cookie("jwt-refresh-token", tokens.refreshToken, {
            httpOnly: true,
            maxAge: 604800000,
            secure: true,
        });
        res.status(200).json({
            success: true,
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler_1.default("Internal server error", 500));
    }
});
exports.loginController = loginController;
