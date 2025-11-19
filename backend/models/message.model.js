// Import Mongoose library
import mongoose from "mongoose";

// Define a Mongoose schema for the Message collection
const messageSchema = new mongoose.Schema({
      // senderId references the User who sent the message
    // ObjectId type links to a document in the 'User' collection
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    // Reference model
        required: true,
    },
        // receiverId references the User who receives the message
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: String,   // The actual message text
    media: String,     // Optional media (image, file, etc.) attached to the message
},
    { timestamps: true }        // Timestamps option automatically adds 'createdAt' and 'updatedAt'
);

// Create and export the Message model based on the schema
// This model is used to interact with the 'messages' collection in MongoDB
export const Message = mongoose.model("Message", messageSchema);