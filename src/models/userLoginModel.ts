import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface IUserLogin extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  refreshToken: string | null;
  generateAuthToken(): { accessToken: string; refreshToken: string };
  changePassword(
    currentPassword: string,
    newPassword: string,
    next: NextFunction
  ): Promise<void>;
}

const userLoginSchema = new Schema<IUserLogin>({
  _id: {
    type: Schema.ObjectId,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  refreshToken: {
    type: String,
    select: false,
    default: null,
  },
});

userLoginSchema.methods.generateAuthToken = async function () {
  const accessToken: string = jwt.sign(
    { _id: this._id },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn: "30m" }
  );
  const refreshToken: string = jwt.sign(
    { _id: this._id },
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
  this.refreshToken = refreshToken;
  await this.save();
  return { accessToken, refreshToken };
};

userLoginSchema.methods.changePassword = async function (
  currentPassword: string,
  newPassword: string,
  next: NextFunction
) {
  try {
    const currentPasswordVerified: boolean = await bcrypt.compare(
      currentPassword,
      this.password
    );
    if (currentPasswordVerified) {
      this.password = newPassword;
      await this.save();
    } else {
      return next(new ErrorHandler("Password didn't match", 401));
    }
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Internal server error", 500));
  }
};

const model = mongoose.model<IUserLogin>("UserLogin", userLoginSchema);
export default model;
