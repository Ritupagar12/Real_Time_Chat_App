// Import Server class from socket.io to create a WebSocket server.
import { Server } from "socket.io";

// This map keeps track of currently connected users and their socket ids.
// Key: userId (application-level id, e.g. MongoDB _id string)
// Value: socket.id (string assigned by socket.io)
const userSocketMap = {};

// `io` will hold the socket.io server instance once initialized.
let io;

/**
 * Initialize socket.io server and configure basic connection handlers.
 * The function receives the HTTP server created from `http.createServer(app)`.
 */
export function initSocket(server) {
    // Create a new socket.io server and allow CORS from your frontend origin.
    io = new Server(server, {
        cors: {
            origin: "https://real-time-chat-app-1-5ked.onrender.com", // only allow your frontend origin(s)
            credentials: true
        },
    });

    // When any client connects, socket.io emits a "connection" event with a socket object.
    io.on("connection", (socket) => {
        console.log("A user connected to the server.", socket.id)

        // Read the userId provided by the client during the handshake.
        const userId = socket.handshake.query.userId
        // If a userId was supplied, map it to the connected socket id.
        // This allows server-side code to look up which socket to emit to for a given userId.
        if (userId) userSocketMap[userId] = socket.id;

        // Broadcast the current list of online users to all clients.
        // Clients can listen for "getOnlineUsers" to update presence UI.
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Handle socket disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected.", socket.io);
            // Remove the disconnected user's mapping from userSocketMap.
            // Important: if the same user is connected from multiple devices, this simple map
            // will forget the last socket — consider storing arrays of socket ids per user if needed.
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));             // Broadcast updated online user list after removal.
        });
    });
}

/**
 * Utility to get a receiver's socket id by their userId.
 * If the user is offline or not in the map, returns undefined.
 */
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// Export the socket.io instance for use in other modules (e.g., controllers).
// Be aware: `io` is only available after initSocket(server) is called.
export { io };