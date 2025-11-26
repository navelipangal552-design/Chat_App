import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

//It is authentication middleware for Socket.IO.
//socketAuthMiddleware protects WebSocket connections.

/*his ensures:

✅ Only logged-in users can connect through WebSockets
✅ Prevents unauthorized users from receiving or sending live messages
✅ Ensures real-time chat is secure */

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // extract JWT token from http-only cookies

/*When the frontend connects to Socket.IO, it automatically sends cookies.
The middleware looks inside the cookie header.
It finds the jwt= cookie.
Extracts the value → this is your login token. */

    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) { //no token
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user from database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }
    // attach user info to socket and It allows your Socket.IO server to know who is connected.
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};