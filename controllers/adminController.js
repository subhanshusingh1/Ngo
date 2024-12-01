// import modules
import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import OTP from "../models/otpModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail.js";
import generateOtp from "../utils/otp.js";
 

// check OTP validity
const isOtpValid = (otpDocument) => {
    const currentTime = new Date();
    return otpDocument && (currentTime - otpDocument.createdAt) < 600000; // 10 minutes expiration time
  };

// @Desc Admin Registration
// @route /api/v1/admin
// Access Admin
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    return res.status(404).json({ message: "All Fields are required" });
  }

  // check if user already exists
  const adminInfo = await Admin.findOne({ email });

  if (adminInfo) {
    return res.status(400).json({ message: "User Already Exists" });
  }

  // Image upload validation
  // if (!req.file || !req.file.path) {
  //   return res
  //     .status(400)
  //     .json({ message: "Image is required for the Admin Profile." });
  // }

  // Extract uploaded img URL from Cloudinary
  // const imageurl = req.file.path;

  // Register the new User
  const admin = await Admin.create({
    name,
    email,
    password
    // profileImage: imageurl
  });

  // create jwt
  const token = await admin.createJwt(res);

  // response
  res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    },
    token,
    message: "User Registered as Admin Successfully",
  });
});

// @Desc Admin Login
// @route /api/v1/admin
// @Access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  // find admin in database
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({
      message: "Admin does not exist. please register",
    });
  }

  // compare password
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  // create jwt token
  await admin.createJwt(res);

  // response
  res.status(200).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    },
    message: "Admin Logged in Successfully",
  });
});

// @Desc Send OTP to Admin's Email
// @Route POST /api/v1/users/send-otp
// Access Public
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email presence
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Check if user exists
  const user = await Admin.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ message: "User does not exist. Please register first." });
  }

  // Generate OTP
  const otp = generateOtp();

  // Save OTP to the database
  await OTP.create({
    email,
    otp,
    createdAt: new Date(),
  });

  // Send OTP to the user via email using sendMail
//   await sendMail(email, otp);

  // Send OTP email
  await sendMail({
    recipientEmail: email,
    subject: "Email Verification from NGO",
    name: email,
    intro: `Your OTP for email verification is: ${otp}`,
  });

  // Send response
  res.status(200).json({
    success: true,
    message: "OTP sent successfully to the registered email.",
  });
});

// @Desc OTP Verification
// @Route POST /api/v1/users/verify-otp
// Access Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate email and OTP presence
  if (!email || !otp) {
    return res.status(400).send({ message: "Email and OTP are required" });
  }

  // Check for existing OTP document
  const otpDocument = await OTP.findOne({ email });

  if (!otpDocument) {
    return res
      .status(404)
      .send({ message: "No OTP record found for the requested email" });
  }

  // Verify OTP
  if (otpDocument.otp !== otp || !isOtpValid(otpDocument)) {
    return res.status(400).send({ message: "Invalid or Expired OTP" });
  }

  // Fetch user
  const user = await Ad.findOne({ email });

  // Create JSON Web Token (JWT) and store it in cookies
  const token = await user.createJwt(res);

  // Respond with success
  res.status(200).send({
    success: true,
    token,
    message: "OTP verified successfully",
  });
});

// @Desc Reset Password
// @Route POST /api/v1/users/reset-password
// Access Private
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate input
  if (!email || !newPassword) {
    return res
      .status(400)
      .send({ message: "Email and new password are required" });
  }

  // Check if user exists
  const user = await Admin.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "User does not exist" });
  }

  // Update user password
  user.password = newPassword;
  await user.save();

  // Send success response
  res.status(200).send({
    success: true,
    message: "Password reset successfully",
  });
});

// @Desc Get User Profile Details
// @Route Get /api/v1/users/profile/:id
// @Acess Admin
const getProfileById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Log the received user ID
  console.log("User ID received:", userId);

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await Admin.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      // data: {
      //   _id: user._id,
      //   name: user.name,
      //   email: user.email,
      // },
      data: user,
      message: "Admin details retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//@Desc Get All User Registered
//@Route Get /api/v1/admin/
// @Access Admin
const getAllProfile = asyncHandler(async (req, res) => {
  // Get All Admin Details
  const admins = await Admin.find({}); // This returns an array

  if (!admins || admins.length === 0) {
      return res.status(400).json({ message: "No admins found." });
  }

  // create jwt
  // const token = await admins.createJwt(res);

  res.status(200).json({
      success: true,
      data: admins,
      message: "All Admin Details Provided",
      // token
  });
});


// @Desc Upload Profile Image
// @Route POST /api/v1/users/upload-profile-image
// @Acess Admin
const uploadProfileImage = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Verify if the admin user is authenticated
        // if (!req.user || !req.user._id) {
        //     return res.status(401).json({ message: "Unauthorized. Please log in." });
        // }

        console.log(req.user);

        const adminId = req.user._id;

        // Update the admin's profile with the new image URL
        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { profileImage: req.file.path }, 
            { new: true }
        );

        // Check if admin exists
        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        return res.status(200).json({
            message: "Profile image uploaded successfully.",
            profileImage: updatedAdmin.profileImage,
        });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(500).json({ message: "Error uploading profile image.", error: error.message });
    }
};


// @Desc Delete User Account
// @Route DELETE /api/v1/users/profile/:id
// @Acess Admin
const removeAdmin = asyncHandler(async (req, res) => {

  // console.log("User ID:", req.user ? req.user.id : "No user in request");

  const { id } = req.params; // Get user ID from params

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  // Check if the user exists
  const user = await Admin.findById(id);
  if (!user) {
    return res.status(404).json({ message: `No user found with id: ${id}` });
  }

  // Check if OTP data exists for the user
  // const otpData = await OTP.findOne({ email: user.email });
  // if (!otpData) {
  //   return res.status(400).json({ message: "No OTP data found for the user" });
  // }

  // Proceed to delete the user and OTP data
  await Admin.deleteOne({ _id: id });
  // await OTP.deleteOne({ _id: otpData._id });

  res.status(200).json({
    success: true,
    message: "Admin Removed Successfully!",
  });
});

// @Desc Generate Refresh Token
// @Route Post /api/v1/users/refresh-token
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh Token not found, please log in again.",
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); // Use a different secret for refresh tokens

    // Find the user by the decoded token's user id
    const user = await Admin.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a new access token
    const newAccessToken = await user.createJwt(res); // This method should create and return the new access token

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid Refresh Token, please log in again.",
    });
  }
});

// @Desc Update Admin Details
// @Route /api/v1/admin/:id
// @Access Admin
const updateAdminProfile = asyncHandler(async (req, res) => {

  const { id } = req.params; 
  const { name, email, password } = req.body; 

  console.log(id);

  try {
    // Find the admin by ID
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update name if provided
    if (name) {
      if (name.trim() === "") {
        return res.status(400).json({ success: false, message: "Name cannot be empty" });
      }
      admin.name = name;
    }

    // Update email if provided and check uniqueness
    if (email && email !== admin.email) {
      // if (!validator.isEmail(email)) {
      //   return res.status(400).json({ success: false, message: "Invalid email format" });
      // }
      const existingEmail = await Admin.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
      admin.email = email.toLowerCase();
    }

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      admin.password = password;
    }

    // Save updated admin data
    const updatedAdmin = await admin.save();

    // Send response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: {
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export {
  register,
  login,
  verifyOtp,
  sendOtp,
  resetPassword,
  updateAdminProfile,
  refreshToken,
  removeAdmin,
  getProfileById,
  getAllProfile,
  uploadProfileImage
};
