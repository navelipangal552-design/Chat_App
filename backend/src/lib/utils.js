 import jwt from "jsonwebtoken"
import { ENV } from "./env.js";

  //fun to create a token
 export const generateToken = (userID,res) => {
   
    const token = jwt.sign({userID},ENV.JWT_SECRET,{
        expiresIn: "7d",
    });

    //send back the token to client using cookies
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000, //in millisec
        httpOnly: true, //security purpose 
        sameSite: "strict",
        secure:ENV.NODE_ENV === "development" ? false: true, //if in development then false , for production true
    });
    return token;
 };