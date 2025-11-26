import { Server } from "socket.io"; //WebSockets for real-time messaging
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

/*
✔ Creates a Socket.IO server
✔ Authenticates users before connecting
✔ Tracks which users are online
✔ Lets controllers know if a user is online
✔ Sends real-time events (messages, online users) */

const app = express();
const server = http.createServer(app); //attach Socket.IO to HTTPServer

//Creates a WebSocket server
// Enables CORS so your frontend can connect
// Allows cookies (JWT) to be sent with socket connection
const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
//runs before every socket connection.
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

/*What happens when a user connects:
Socket is authenticated
userId is extracted
Their socket.id is stored
Server broadcasts updated online user list to ALL clients */
// // with socket.on we listen for events from clients

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

 

  /*When user closes app or loses connection:

✔ Remove their socket entry
✔ Emit getOnlineUsers again
✔ All users see updated online list */

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server }; //server.listen() to start the app , Controllers to send real-time messages using io