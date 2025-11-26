import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// import "dotenv/config";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";


export const signup =  async (req, res) => { //exports a function so it can be used in the /signup route
//   res.send("Signup point");
const {fullName,email,password} = req.body; //reads user input

//check for valid details
try{
    if(!fullName || !email || !password){ //If any field is missing → return an error (HTTP 400 = Bad Request)
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
 //Even the database owner cannot see the user’s real password.

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
        generateToken(newUser._id,res) //creates a JWT token and stores it in a cookie so the user stays logged in

//  Send Success Response to Client
        res.status(201).json({ // 201 means something is created successfully
            _id: newUser._id,
            fullName:newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

        try{
        await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL); //send email to user
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
     if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

    const user = await User.findOne({ email }); //Searches the database for a user with that email
    if (!user) return res.status(400).json({ message: "Invalid credentials" }); //if not found
    
    // never tell the client which one is incorrect: password or email
    
    //Takes the plain text password from login form.
    //Compares it with the hashed password stored in DB.
    //bcrypt automatically handles hashing + comparison.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    //handle wrong passwords  
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

// Creates a JWT token (generateToken)
// Stores it inside a secure HTTP-only cookie
// Cookie automatically logs the user in for future requests
    generateToken(user._id, res);

//Return User Info (But Not Password!)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => { //here no request only response so 1st place is blank here 
  res.cookie("jwt", "", { maxAge: 0 }); //Sets the cookie named "jwt" To an empty string And makes it expire immediately (maxAge: 0)
  res.status(200).json({ message: "Logged out successfully" });
};

//if a request is done by the user to change his/her profile pic , we need to check if user is authenticated or not --> this is 
// done using protect route middleware
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; //user uploads an image
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" }); //If no image is sent → return error 400 Bad Request.

    const userId = req.user._id; //based on user id update that pic

/*Cloudinary handles:
Storing the file
Automatically generating different sizes
Returning the secure URL*/

    const uploadResponse = await cloudinary.uploader.upload(profilePic);//Upload the image to Cloudinary

    const updatedUser = await User.findByIdAndUpdate( //updates the profilePic field.
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true } //return the updated user instead of old user
    );

    res.status(200).json(updatedUser);
    
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};