 import jwt from "jsonwebtoken"

  //fun to create a token
 export const generateToken = (userID,res) => {
   
    const token = jwt.sign({userID},process.env.JWT_SECRET,{
        expiresIn: "7d",
    });

    //send back the token to client using cookies
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000, //in millisec
        httpOnly: true, //security purpose 
        sameSite: "strict",
        secure:process.env.NODE_ENV === "development" ? false: true, //if in development then false , for production true
    });
    return token;
 };