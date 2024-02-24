import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserLoginModel from "../../models/userLoginModel";
import ErrorHandler from "../../utils/ErrorHandler";

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body.userId;
  const refreshToken = req.cookies["jwt-refresh-token"];
  const user = await UserLoginModel.findById(userId).select("refreshToken");
  if (!user) {
    return new ErrorHandler("Invalid refresh token", 401);
  }
  const decodedJwt = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;
  if (decodedJwt._id !== String(user._id)) {
    return next(new ErrorHandler("Invalid token", 403));
  }
  if (refreshToken !== user.refreshToken) {
    return next(new ErrorHandler("Invalid token", 403));
  }
  const newAccessToken: string = jwt.sign(
    { _id: user._id },
    process.env.JWT_ACCESS_TOKEN_SECRET || user.email,
    { expiresIn: "30m" }
  );
  res.status(200).json({
    accessToken: newAccessToken,
  });
};
