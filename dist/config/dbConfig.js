"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = () => {
    const DB_URI = process.env.MONGO_DB_URI;
    if (!DB_URI) {
        return console.log("DB_URI is not available");
    }
    mongoose_1.default
        .connect(DB_URI)
        .then(() => {
        console.log("DB is connected");
    })
        .catch((e) => {
        console.log(e);
    });
};
exports.dbConnect = dbConnect;
