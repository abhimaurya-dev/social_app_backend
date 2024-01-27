import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IUserLogin extends Document {
  email: string;
  password: string;
  refreshToken: string | null;
}

const userLoginSchema = new Schema<IUserLogin>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

const model = mongoose.model<IUserLogin>("UserLogin", userLoginSchema);

userLoginSchema.pre("save", async function () {
  const generatedPasswordSalt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, generatedPasswordSalt);
});

userLoginSchema.method("generateAuthToken", function () {
  try {
    const accessToken: string = jwt.sign(
      { _id: this._id },
      process.env.JWT_ACCESS_TOKEN_SECRET || this.email,
      { expiresIn: "30m" }
    );
    const refreshToken: string = jwt.sign(
      { _id: this._id },
      process.env.JWT_REFRESH_TOKEN_SECRET || this.email,
      { expiresIn: "30m" }
    );
    this.refreshToken = refreshToken;
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
});

userLoginSchema.method(
  "canRefreshAuthToken",
  async function (refreshToken: string, next: NextFunction) {
    const decodedId = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET || this.email
    );
    if (decodedId !== this._id) {
      return next(new ErrorHandler("Invalid token", 403));
    }
    if (refreshToken !== this.refreshToken) {
      return next(new ErrorHandler("Invalid token", 403));
    }
    return true;
  }
);

userLoginSchema.method(
  "changePassword",
  async function (
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
  }
);

export default model;
