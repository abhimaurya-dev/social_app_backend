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
exports.refreshTokenController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userLoginModel_1 = __importDefault(require("../../models/userLoginModel"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const refreshTokenController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const refreshToken = req.cookies["jwt-refresh-token"];
    const user = yield userLoginModel_1.default.findById(userId).select("refreshToken");
    if (!user) {
        return new ErrorHandler_1.default("Invalid refresh token", 401);
    }
    const decodedJwt = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    if (decodedJwt._id !== String(user._id)) {
        return next(new ErrorHandler_1.default("Invalid token", 403));
    }
    if (refreshToken !== user.refreshToken) {
        return next(new ErrorHandler_1.default("Invalid token", 403));
    }
    const newAccessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET || user.email, { expiresIn: "30m" });
    res.status(200).json({
        accessToken: newAccessToken,
    });
});
exports.refreshTokenController = refreshTokenController;
