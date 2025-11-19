import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";

// Utilities from your socket module to send real-time events
import { getReceiverSocketId, io } from "../utils/socket.js";

/**
 * Get all users except the currently authenticated user.
 * Returns an array of users (without passwords) so the client can show who is available to chat.
 */
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = req.user; // populated by isAuthenticated middleware
    // Find all users except the logged-in user.
    const filteredUsers = await User.find({ _id: { $ne: user } }).select(
        "-password" // exclude password field from the returned documents
    );
    res.status(200).json({
        success: true,
        users: filteredUsers,
    });
});

/**
 * Get messages between the logged-in user and a receiver.
 * Expects receiver id as a route parameter (:id).
 * Returns messages sorted ascending by creation time.
 */
export const getMessages = catchAsyncError(async (req, res, next) => {
    const receiverId = req.params.id;   // the other user's id
    const myId = req.user._id;          // logged-in user id
    const receiver = await User.findById(receiverId);
    if (!receiverId) {      // Validate receiverId presence
        return res.status(400).json({
            success: false,
            message: "Receiver ID invalid.",
        });
    }

    // Query messages where either (sender: me & receiver: them) or (sender: them & receiver: me)
    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: receiverId },
            { senderId: receiverId, receiverId: myId },
        ],
    }).sort({ createdAt: 1 });   // sort ascending so older messages come first
    res.status(200).json({
        success: true,
        messages,
    });
});

/**
 * Send a message to a receiver.
 * Accepts optional `media` file upload and/or text body.
 * Saves message to DB and emits a real-time `newMessage` event to the receiver if they're online.
 */
export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { text } = req.body;    // text content (optional if media present)
    const media = req?.files?.media;     // optional uploaded file (via express-fileupload)
    const { id: receiverId } = req.params;  // receiver id from URL
    const senderId = req.user._id;    // logged-in user id
    const receiver = await User.findById(receiverId);

    // Validate receiver id
    if (!receiverId) {
        return res.status(400).json({
            success: false,
            message: "Receiver ID invalid.",
        });
    }
    const sanitizedText = text?.trim() || "";       // Trim and sanitize text; fallback to empty string

    // Reject empty messages (no text and no media)
    if (!sanitizedText && !media) {
        return res.status(400).json({
            success: false,
            message: "Can not send empty message.",
        });
    }

    // If media exists, upload to Cloudinary and get a secure URL to save in DB
    let mediaUrl = "";
    if (media) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(
                media.tempFilePath,     // path to temp file saved by express-fileupload
                {
                    resource_type: "auto",   // allow images, videos, other file types
                    folder: "REALTIME_CHAT_APP",     // folder in your Cloudinary account
                    transformation: [
                        { width: 1000, height: 1000, crop: "limit" },
                        { quality: "auto" },     // let Cloudinary pick quality
                        { fetch_format: "auto" },    // serve optimal format
                    ],
                }
            );
            mediaUrl = uploadResponse?.secure_url;              // Use Cloudinary's secure URL for the stored media
        }
        catch (error) {
            console.error("Cloudinary upload error: ", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload media. Please try again later.",
            });
        }
    }

    // Create and persist the message document in MongoDB
    const newMessage = await Message.create({
        senderId,
        receiverId,
        text: sanitizedText,
        media: mediaUrl,
    });
    // If the receiver is online, find their socket id and emit the new message in real time
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        // `io` is the socket.io server instance exported from utils/socket
        // We send the `newMessage` event directly to the receiver's socket id.
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    // Return created message as API response (useful for sender's UI)
    res.status(201).json(newMessage);
});