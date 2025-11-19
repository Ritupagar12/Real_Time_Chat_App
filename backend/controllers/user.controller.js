// Import async error wrapper for cleaner async code
import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"

// Import User model to interact with MongoDB users collection
import { User } from "../models/user.model.js";

// Import bcrypt for password hashing and verification
import bcrypt from "bcryptjs";

// Import JWT token generator utility
import { generateJwtToken } from "../utils/jwtToken.js";

// Import Cloudinary SDK for uploading/deleting profile images
import { v2 as cloudinary } from "cloudinary";

// ------------------------ SIGN-UP CONTROLLER ------------------------
export const signup = catchAsyncError(async (req, res, next) => {
    const { fullName, email, password } = req.body;
    // Validate required fields
    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required details.",
        });
    }
    // Basic email validation pattern
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format.",
        });
    }
    // Ensure password meets length requirements
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long.",
        });
    }
    // Check if user with this email already exists
    const isEmailAlreadyUsed = await User.findOne({ email });
    if (isEmailAlreadyUsed) {
        return res.status(400).json({
            success: false,
            message: "Email is already registered.",
        });
    }

    // Hash password using bcrypt before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user document
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        avatar: {
            public_id: "",
            url: "",
        },
    });

    // Generate JWT and respond
    generateJwtToken(user, "User registered successfully!", 201, res);

});

// ------------------------ SIGN-IN CONTROLLER ------------------------
export const signin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password.",
        });
    }
    // Check email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format.",
        });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials.",
        });
    }
    // Compare password with hashed one in DB
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials.",
        });
    }
    // Generate token if authenticated successfully
    generateJwtToken(user, "User logged in successfully.", 200, res);
});

// ------------------------ SIGN-OUT CONTROLLER ------------------------
export const signout = catchAsyncError(async (req, res, next) => {
    // Clear the authentication token cookie by setting it to empty with zero lifetime
    res.status(200).cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" ? true : false,
    })
        .json({
            success: true,
            message: "User logged out successfully.",
        });
});

// ------------------------ GET CURRENT USER CONTROLLER ------------------------
export const getUser = catchAsyncError(async (req, res, next) => {
    //const user = await User.findById(req.user._id);
    // req.user is set by the authentication middleware
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

// ------------------------ UPDATE PROFILE CONTROLLER ------------------------
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { fullName, email } = req.body;
        // Prevent empty name or email
    if (fullName?.trim().length === 0 || email?.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Fullname and Email can't be empty.",
        });
    }
      // Check if avatar image is uploaded
    const avatar = req?.files?.avatar;
    let cloudinaryResponse = {};
        // If a new avatar is provided, handle Cloudinary upload
    if (avatar) {
        try {
                        // Delete old avatar if one exists
            const oldAvatarPublicId = req.user?.avatar?.public_id;
            if (oldAvatarPublicId && oldAvatarPublicId.length > 0) {
                await cloudinary.uploader.destroy(oldAvatarPublicId);
            }
                        // Upload new avatar with transformations (resize, quality optimization)
            cloudinaryResponse = await cloudinary.uploader.upload(
                avatar.tempFilePath,
                {
                    folder: "REALTIME_CHAT_APP_USERS_AVATARS",
                    transformation: [
                        { width: 300, height: 300, crop: "limit" },
                        { quality: "auto" },
                        { fetch_format: "auto" },
                    ],
                }
            );
        } catch (error) {
            console.error("Cloudinary upload error: ", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload avatar. Please try again later.",
            })
        }
    }

        // Prepare update data
    let data = {
        fullName,
        email,
    };

        // If new avatar uploaded successfully, include it in update
    if (avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url) {
        data.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

        // Update user in the database and return updated document
    let user = await User.findById(req.user._id, data, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user,
    });
});
