import mongoose from "mongoose";
// import { use } from "react";

//created a Schema
const userSchema = new mongoose.Schema({ //we passed an object
    email:{
        type: String,
        required : true,
        unique: true, //every email should be unique
    },
    fullName:{
        type: String,
        required : true,
    },
    password:{
        type: String,
        required : true,
        minlength:10, 
    },
    profilePic:{
        type: String,
        default: "",
    },

},{timestamps:true} //2nd object 
);

const User = mongoose.model("User",userSchema); //created a user object via we can interact with the database 

export default User;