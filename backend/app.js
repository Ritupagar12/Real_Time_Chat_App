// Express framework to create and manage a web server and API routes
import express from "express"; 

// Importing cookie-parser to read cookies from incoming HTTP requests
// This helps in authentication (like storing JWT tokens in cookies)
import cookieParser from "cookie-parser";

// Importing dotenv’s config function to load environment variables from a .env file
// Useful for storing sensitive information like API keys, DB URIs, etc.
import { config } from "dotenv";

// Importing express-fileupload middleware to handle file uploads (e.g. images, PDFs, etc.)
// It makes uploaded files accessible through req.files
import fileUpload from "express-fileupload";

// Importing CORS (Cross-Origin Resource Sharing) middleware
// It allows your backend API to be accessed by your frontend app (running on a different domain or port)
import cors from "cors";

// Importing the dbConnection function from database/db.js
import { dbConnection } from "./database/db.js";

// Importing user routes from the routes folder
import userRouter from "./routes/user.routes.js";

// Importing message routes from the routes folder
import messageRouter from "./routes/message.routes.js";

// Creating an instance of the express application
// `app` will be used to define routes, middlewares, and server settings
const app = express();

// Loading environment variables from the file ./config/config.env
config({ path: "./config/config.env" });

// Configuring CORS middleware
// This ensures your frontend can communicate with your backend without browser blocking requests
app.use(cors({
    origin: process.env.FRONTEND_URL, // Only allow requests from this specific frontend URL (for security)
    credentials: true,  // Allow cookies, tokens, and other credentials to be sent in requests
    methods: ["GET", "POST", "PUT", "DELETE"],  // Define which HTTP methods are allowed from the frontend
    allowedHeaders: ["Content-Type", "Authorization"]
})
);

// Parse cookies attached to the client request object
// This makes cookies available under req.cookies
app.use(cookieParser());

// Parse incoming JSON data from request bodies
// For example, when frontend sends JSON with POST or PUT requests
app.use(express.json());

// Parse URL-encoded data (from forms or traditional HTML submissions)
// extended: true allows rich objects and arrays to be encoded
app.use(express.urlencoded({ extended: true }));

// Configure file upload handling
// useTempFiles: true means uploaded files are temporarily saved on disk (instead of memory)
// tempFileDir: defines the folder where those temporary files will be stored
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./temp/",
    })
);

// Mounting all user-related routes under /api/v1/user
app.use("/api/v1/user", userRouter);

// Mounting all message-related routes under /api/v1/message
app.use("/api/v1/message", messageRouter);

// Calling the database connection function to establish connection as soon as the server starts
dbConnection();

// Exporting the configured Express app so it can be used in other files (like server.js)
export default app;