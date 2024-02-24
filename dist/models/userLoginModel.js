"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userLoginSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    refreshToken: {
        type: String,
        select: false,
        default: null,
    },
});
userLoginSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = jsonwebtoken_1.default.sign({ _id: this._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        this.refreshToken = refreshToken;
        yield this.save();
        return { accessToken, refreshToken };
    });
};
userLoginSchema.methods.changePassword = function (currentPassword, newPassword, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentPasswordVerified = yield bcryptjs_1.default.compare(currentPassword, this.password);
            if (currentPasswordVerified) {
                this.password = newPassword;
                yield this.save();
            }
            else {
                return next(new ErrorHandler_1.default("Password didn't match", 401));
            }
        }
        catch (error) {
            console.log(error);
            next(new ErrorHandler_1.default("Internal server error", 500));
        }
    });
};
const model = mongoose_1.default.model("UserLogin", userLoginSchema);
exports.default = model;
