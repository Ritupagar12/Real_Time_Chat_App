import express from "express";    // Importing Express to create routes
// Importing controller functions that handle each user-related operation
import {getUser, signin, signout, signup, updateProfile} from "../controllers/user.controller.js";
// Importing authentication middleware to protect routes
import { isAuthenticated } from "../middlewares/auth.middleware.js";

// Creating a new router instance
const router = express.Router();

router.post("/sign-up", signup);    // Route for user registration
router.post("/sign-in", signin);    // Route for user login
router.get("/sign-out", isAuthenticated, signout);  // Route for user logout (only accessible if authenticated)
router.get("/me", isAuthenticated, getUser);    // Route to get the currently logged-in user’s details
router.put("/update-profile", isAuthenticated, updateProfile);  // Route to update user profile details (protected)

export default router;  // Export router so it can be used in app.js
