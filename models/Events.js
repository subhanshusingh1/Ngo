import mongoose from "mongoose";
import validator from "validator";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";


const eventSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: [true, "Event start date and time are required"],
      validate: {
        validator: (value) => value >= new Date(),
        message: "Event start date and time cannot be in the past",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
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
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
      },
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
