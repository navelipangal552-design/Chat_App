
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV; //Reads JWT_SECRET from ENV.
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, { //Generates a JWT containing { userId }, valid for 7 days.
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // How long the cookie stays in the browser - i.e 7 days (MS)
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "lax",             
    secure: ENV.NODE_ENV === "production", 
  path: "/",     
  });

  return token;
};

/* 
Tokens allow (JWT → JSON Web Token) 
(JSON -> javaScript Object Notation)= It is a lightweight format used to store, send, and exchange data between a client (frontend) and a server (backend).

1. Know who is logged in
2. Signed → cannot be faked (Security)
3. Flexibilty (web,apps,API..)
4. 
*/
