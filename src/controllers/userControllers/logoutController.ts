import { Request, Response } from "express";
import UserLoginModel from "../../models/userLoginModel";
import ErrorHandler from "../../utils/ErrorHandler";

export const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt-refresh-token");
    await UserLoginModel.findByIdAndUpdate(req.body.userId, {
      refreshToken: null,
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return new ErrorHandler("Internal Server Error", 500);
  }
};
