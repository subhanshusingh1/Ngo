import mongoose from "mongoose";
import validator from "validator";

const volunteerSchema = new mongoose.Schema(
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
    mobile: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (value) => validator.isMobilePhone(value, "any"),
        message: "Invalid phone number",
      },
    },
    event: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Volunteer", volunteerSchema);
