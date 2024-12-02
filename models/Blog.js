import mongoose from "mongoose";
import validator from "validator";
// import jwt from 'jsonwebtoken'
// import bcrypt from "bcryptjs";


const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    profileImage: [
      {
        type: String,
        validate: {
          validator: validator.isURL,
          message: "Invalid URL format",
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", blogSchema);
