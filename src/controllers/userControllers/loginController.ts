import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserLoginModel from "../../models/userLoginModel";
import UserModel from "../../models/userModel";
import ErrorHandler from "../../utils/ErrorHandler";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email || !req.body.password) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const email: string = req.body.email;
  const password: string = req.body.password;
  try {
    const userLogin = await UserLoginModel.findOne({ email }).select(
      "+password"
    );
    const user = await UserModel.findOne({ email });
    if (!userLogin) {
      return next(new ErrorHandler("User not found", 404));
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      userLogin.password
    );
    if (!isPasswordValid) {
      console.log("not valid");
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const userInstance = new UserLoginModel(userLogin);
    const tokens = await userInstance.generateAuthToken();
    res.cookie("jwt-refresh-token", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
    });
    res.status(200).json({
      success: true,
      user,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Internal server error", 500));
  }
};
