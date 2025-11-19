// Importing Mongoose to connect and interact with MongoDB
import mongoose from "mongoose";

// Exporting a function that connects the backend to MongoDB
// This keeps the connection logic modular and reusable
export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN_STACK_CHAT-APPLICATION",  // The name of the database inside MongoDB
    })
    .then(() => {
        console.log("Connected to database.");  // If the connection is successful, log confirmation
    })
    .catch((err) => {
        console.log(`Error connecting to database: ${err.message || err}`);  // If the connection fails, log the error message
    });
};
