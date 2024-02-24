import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

import UserModel from "../../models/userModel";
import UserLoginModel from "../../models/userLoginModel";
import ErrorHandler from "../../utils/ErrorHandler";

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name: string = req.body.name;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const dob: string = req.body.dob;
    const gender: string = req.body.gender;
    const user = {
      name,
      email,
      dob,
      gender,
    };
    const newUser = new UserModel(user);
    await newUser.save();
    const generatedPasswordSalt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(
      password,
      generatedPasswordSalt
    );
    const userLogin = {
      _id: newUser._id,
      email,
      password: hashedPassword,
    };
    const newUserLogin = new UserLoginModel(userLogin);
    await newUserLogin.save();
    const tokens = await newUserLogin.generateAuthToken();
    res.cookie("jwt-refresh-token", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
    });
    res.status(200).json({
      success: true,
      user: newUser,
      accessToken: tokens.accessToken,
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === 11000) {
      return next(new ErrorHandler("User already exists", 403));
    } else next(new ErrorHandler("Internal server error", 500));
  }
};
