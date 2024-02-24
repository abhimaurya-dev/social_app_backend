"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dbConfig_1 = require("./config/dbConfig");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorHandlerMiddleware_1 = require("./middlewares/errorHandler/errorHandlerMiddleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["content-type", "Authorization"],
    optionSuccessStatus: 200,
};
app.use((0, morgan_1.default)("common"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
dotenv_1.default.config({ path: "src/config.env" });
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Social Server",
    });
});
app.use("/api/v1/", userRoutes_1.default);
// middlewares
app.use((err, req, res, next) => (0, errorHandlerMiddleware_1.errorHandlerMiddleware)(req, res, err, next));
app.listen(process.env.PORT, () => {
    (0, dbConfig_1.dbConnect)();
    console.log(`Server is Running on Port ${process.env.PORT}`);
});
