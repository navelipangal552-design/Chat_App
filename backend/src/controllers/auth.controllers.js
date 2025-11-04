import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// import "dotenv/config";
import { ENV } from "../lib/env.js";

export const signup =  async (req, res) => {
//   res.send("Signup point");
const {fullName,email,password} = req.body; //user input

//check for valid details
try{
    if(!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    if(password.length < 6){
         return res.status(400).json({message:"Passwords must be at least 6 characters"});
    }

    //check if emails valid using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return req.status(400).json({message:"Invalid email format"});
    }
    //if already email used/created  
    const user=await User.findOne({email});
    if(user) return  res.status(400).json({message:"Email  already exist"})
    
    const salt = await bcrypt.genSalt(10); //Generates a random salt value.
    //Salt: A unique string added to a password before hashing - protect your data
    //to store in database we store hash_passwords
    const hash_pass = await bcrypt.hash(password,salt); //Takes the user’s plain-text password and hashes it with the salt.

    //created new user and
    const newUser = new User({
        fullName,
        email,
        password: hash_pass,
    })
    //generate new token(JWT)
    if(newUser)
    { //authenticate the user 
        await newUser.save() //save user to database
        generateToken(newUser._id,res)
        
        res.status(201).json({ // 201 means something is created successfully
            _id: newUser._id,
            fullName:newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

        try{
          await sendWelcomeEmail(savedUser.email,savedUser.fullName,ENV.CLIENT_URL);
        } catch(error){
           console.error("Failed to send welcome email:",error);
        }
    }else{
        res.status(400).json({message:"Invalid user data"})
    }
} catch(error)
{
    console.log("Error in signup controller:",error)
    res.status(500).json({message:"Internal server error"});
}

};