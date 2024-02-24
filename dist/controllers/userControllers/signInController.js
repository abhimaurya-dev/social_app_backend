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
exports.signInController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const userLoginModel_1 = __importDefault(require("../../models/userLoginModel"));
const ErrorHandler_1 = __importDefault(require("../../utils/ErrorHandler"));
const signInController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const dob = req.body.dob;
        const gender = req.body.gender;
        const user = {
            name,
            email,
            dob,
            gender,
        };
        const newUser = new userModel_1.default(user);
        yield newUser.save();
        const generatedPasswordSalt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, generatedPasswordSalt);
        const userLogin = {
            _id: newUser._id,
            email,
            password: hashedPassword,
        };
        const newUserLogin = new userLoginModel_1.default(userLogin);
        yield newUserLogin.save();
        const tokens = yield newUserLogin.generateAuthToken();
        res.cookie("jwt-refresh-token", tokens.refreshToken, {
            httpOnly: true,
            maxAge: 604800000,
        });
        res.status(200).json({
            success: true,
            user: newUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
    catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return next(new ErrorHandler_1.default("User already exists", 403));
        }
        else
            next(new ErrorHandler_1.default("Internal server error", 500));
    }
});
exports.signInController = signInController;
