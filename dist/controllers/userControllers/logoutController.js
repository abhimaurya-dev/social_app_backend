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
exports.logoutController = void 0;
const userLoginModel_1 = __importDefault(require("../../models/userLoginModel"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("jwt-refresh-token");
        yield userLoginModel_1.default.findByIdAndUpdate(req.body.userId, {
            refreshToken: null,
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    }
    catch (error) {
        console.log(error);
        return new ErrorHandler_1.default("Internal Server Error", 500);
    }
});
exports.logoutController = logoutController;
