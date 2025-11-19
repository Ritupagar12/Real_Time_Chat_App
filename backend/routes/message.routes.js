import express from "express";
import { getAllUsers, getMessages, sendMessage } from "../controllers/message.controller.js"; // Import controller functions that handle each route
import { isAuthenticated } from "../middlewares/auth.middleware.js";    // Import auth middleware so these routes are protected

const router = express.Router();

// GET /users - list all users except current user (used to show contacts)
router.get("/users", isAuthenticated, getAllUsers);

// GET /:id - get the conversation between current user and user with id :id
router.get("/:id", isAuthenticated, getMessages);

// POST /send/:id - send a message to user with id :id (protected)
router.post("/send/:id", isAuthenticated, sendMessage);


export default router;