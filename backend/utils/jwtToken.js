// Importing jsonwebtoken library to create and verify JWT tokens
import jwt from "jsonwebtoken";

// A reusable function to generate JWT tokens and send them in cookies + response
export const generateJwtToken = async (User, message, statusCode, res) => {
    // Create a signed token containing the user ID and expiration time
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    // Send token as an HTTP-only cookie and also in the JSON response
    return res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true, // prevents JavaScript access (security)
            secure: true, // must be true in prod
            sameSite: "none",// cross site for prod
            domain: ".onrender.com",
            path: "/",
            maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,    // cookie expiry time in ms
        })
        .json({
            success: true,
            message,
            token,
        });
};