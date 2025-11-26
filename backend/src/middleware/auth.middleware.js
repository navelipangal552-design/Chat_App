import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

//When a user logs in, you set a cookie called jwt
//this function is used to acesss private routes

//protectRoute protects HTTP routes
/*It checks:
Do you have a token?
Is the token valid?
Does the user exist? */

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //retrieve the token
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" }); //If no token → the user is not logged in

    //verify the token (if not expired, Was signed using your secret key etc)
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId).select("-password"); //Get the actual user from the database and attach it to the request
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; //attach 
    next();//Allow the request to continue and request moves on to the actual route handler.

  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};