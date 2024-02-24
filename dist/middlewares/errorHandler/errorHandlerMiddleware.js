"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const errorHandlerMiddleware = (req, res, error, next) => {
    const message = error.message || "Internal Server Error";
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });
    next();
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
