//Mongoose is used to create schemas and models for MongoDB.
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { //Stores which user sent the message
      type: mongoose.Schema.Types.ObjectId, //ObjectId refers to a document in the User collection
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { //text message 
      type: String, 
      trim: true, //removes extra spaces
      maxlength: 2000, //message can't exceed 2000 characters
    },
    image: {
      type: String, //store the URL of the image
    },
  },
  { timestamps: true } //creation and updation time 
);

const Message = mongoose.model("Message", messageSchema); //converts the schema into a MongoDB collection names "Message"

export default Message; //So other files (controllers) can use