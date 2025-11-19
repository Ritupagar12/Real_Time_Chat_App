// Import Mongoose library to create schemas and models for MongoDB
import mongoose from "mongoose";

// Define a Mongoose schema for the User collection
// A schema defines the structure of documents in the MongoDB collection
const userSchema = new mongoose.Schema({
    // Full name of the user, required field
    fullName: {
        type: String,
        required: true,
    },
        // Email of the user, required field
    email: {
        type: String,
        required: true,
    },
     // Password of the user, required field
    // Typically hashed before saving to the database
    password: {
        type: String,
        required: true,
    },
      // Avatar object containing public_id and url
    // public_id is used by Cloudinary, url is the actual image link
    avatar: {
        public_id: String,
        url: String,
    },
},
    { timestamps: true }   // Timestamps option automatically adds 'createdAt' and 'updatedAt' fields
);

// Create and export the User model based on the schema
// This model is used to interact with the 'users' collection in MongoDB
export const User = mongoose.model("User", userSchema);