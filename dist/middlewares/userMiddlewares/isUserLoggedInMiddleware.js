"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserloggedInMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const isUserloggedInMiddleware = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const userAuthToken = req.headers.authorization.slice(7, req.headers.authorization.length);
            if (!userAuthToken) {
                return next(new ErrorHandler_1.default("Unauthorized access", 401));
            }
            if (process.env.JWT_ACCESS_TOKEN_SECRET) {
                const userPayload = jsonwebtoken_1.default.verify(userAuthToken, process.env.JWT_ACCESS_TOKEN_SECRET);
                req.body.userId = userPayload;
            }
        }
        else {
            return next(new ErrorHandler_1.default("Unauthorized access", 401));
        }
        next();
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler_1.default("Internal server error", 500));
    }
};
exports.isUserloggedInMiddleware = isUserloggedInMiddleware;
