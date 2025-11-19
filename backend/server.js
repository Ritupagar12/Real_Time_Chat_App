// Importing the Express application configured in app.js
// This app already includes middlewares like CORS, cookie-parser, and file upload
import app from "./app.js";

// Importing Cloudinary’s v2 API for image and file uploads to the cloud
// Cloudinary helps manage, optimize, and serve images efficiently
import {v2 as cloudinary} from "cloudinary";

// Import Node's built-in HTTP module so we can create a raw server and attach socket.io to it.
import http from "http";

// Import your socket initialization helper — this will attach socket.io to the HTTP server.
import {initSocket} from "./utils/socket.js";

// Configuring Cloudinary with credentials stored in environment variables
// This links your backend to your Cloudinary account securely
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // Your Cloudinary account name
    api_key: process.env.CLOUDINARY_API_KEY,         // Public API key
    api_secret: process.env.CLOUDINARY_API_SECRET,   // Private API secret
});

// Create a Node HTTP server from the Express app.
// We create the server explicitly so socket.io can piggyback on the same server/port.
const server = http.createServer(app);

// Initialize sockets by giving the HTTP server to your socket setup function.
// initSocket will create a socket.io server instance and attach handlers.
initSocket(server);

// Start listening on the port from environment variables.
// We use server.listen so both HTTP and WebSocket connections are accepted on the same port.
server.listen(process.env.PORT, () => {
    console.log(
        `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
    );
});
