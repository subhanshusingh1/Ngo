import mongoose from "mongoose";
import validator from "validator";

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
      required: [true, "Message is Required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Form", formSchema);
