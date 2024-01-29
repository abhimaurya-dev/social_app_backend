import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserLoginModel from "../../models/userLoginModel";
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
    const user = await UserLoginModel.findOne({ email });
    const userInstance = new UserLoginModel(user);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      console.log("not valid");
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const tokens = await userInstance.generateAuthToken();
    res.status(200).json({
      success: true,
      tokens,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Internal server error", 500));
  }
};
