import jwt from "jsonwebtoken"; // Importing jwt to verify tokens
import { User } from "../models/user.model.js"; // Importing User model to find user from decoded token data
import { catchAsyncError } from "./catchAsyncError.middleware.js"; // Importing async error wrapper to handle exceptions in async functions

// Middleware to check if a user is authenticated before accessing certain routes
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    // Extract token from cookies
    const { token } = req.cookies;
    // If no token, user is not logged in
    if (!token) {
        return (
            res.status(401).json({
                success: false,
                message: "User not authenticated. Please sign in.",
            })
        );
    }
    // Verify token with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // If token invalid or expired
    if (!decoded) {
        return res.status(500).json({
            success: false,
            message: "Token verification failed. Please sign in again.",
        })
    }
    // Find user from decoded ID and attach to request object
    const user = await User.findById(decoded.id);
    req.user = user;
    next();     // Move to the next middleware or route handler
});