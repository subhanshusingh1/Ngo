// import files
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: 6,
    },
    profileImage: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: "Invalid URL format"
      },
    },
    refreshTokens: {
      type: [String], // Store multiple refresh tokens for multi-device login
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hashing Password using Bcrypt
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparing Password
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Access Token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Short-lived token
  );
};

// Generating Refresh Token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Long-lived token
  );
};

// Create JWT and store it in cookies
adminSchema.methods.createJwt = async function (res) {
  const accessToken = this.generateAccessToken();
  const refreshToken = this.generateRefreshToken();

  // Add refresh token to the database
  this.refreshTokens.push(refreshToken);
  try {
    await this.save();
  } catch (err) {
    throw new Error("Error saving refresh token to database");
  }

  // Set access token cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
};

// Export model
export default mongoose.model("Admin", adminSchema);
