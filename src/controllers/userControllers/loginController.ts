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
  console.log("invoking login");
  if (!req.body.email || !req.body.password) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const email: string = req.body.email;
  const password: string = req.body.password;
  try {
    const userLogin = await UserLoginModel.findOne({ email }).select(
      "+password"
    );
    console.log(userLogin);
    const user = await UserModel.findOne({ email });
    if (!userLogin) {
      return next(new ErrorHandler("User not found", 404));
    }
    console.log("getting user");
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      userLogin.password
    );
    console.log("password check successful");
    if (!isPasswordValid) {
      console.log("not valid");
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const userInstance = new UserLoginModel(userLogin);
    console.log("generating tollen");
    const tokens = await userInstance.generateAuthToken();
    res.cookie("jwt-refresh-token", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
      secure: true,
    });
    console.log("everything successfull return");
    res.status(200).json({
      success: true,
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    console.log("login ended");
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Internal server error", 500));
  }
};
