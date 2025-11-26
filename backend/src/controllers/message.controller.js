import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

//this function prevent the current user from appearing in the contact list
export const getAllContacts = async (req, res) => { //Fetches all users except the currently logged-in user.
  try {
    const loggedInUserId = req.user._id; //access from JWT 
    //"find all users whose id ≠ loggedInUserId" and removes the password field before sending to frontend.
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
/* Fetches all chat messages between:
   Logged-in user
   The user they clicked on */
//this function helps to display chat history in UI 
export const getMessagesByUserId = async (req, res) => { //retrieves all chat messages between the logged-in user and another user(chat history)
  try {
    const myId = req.user._id; //logged-in user (sender or receiver)
    const { id: userToChatId } = req.params; //to other userand its acessed from message URL

    const messages = await Message.find({ //fetch all msg between them
      $or: [ //match one of them
        { senderId: myId, receiverId: userToChatId }, //either sender have sent or
        { senderId: userToChatId, receiverId: myId }, //reciever have recived    both been fetch
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => { //Sending a text or image message
//   Uploading the image to Cloudinary if provided
//   Saving the message to MongoDB
//   Sending the message in real time using Socket.IO (if the receiver is online)
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params; //from URL
    const senderId = req.user._id; //taken from JWT-auth middleware

    // validations
    if (!text && !image) { //Message must have at least text OR image.
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) { //if message is an attached image

 /*Upload it to Cloudinary
   Cloudinary returns a hosted URL
   Store that URL in the database*/
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
//save the message to database
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, //image url(optional)
    });
    await newMessage.save();

    //Real-Time Messaging (Socket.IO)
   /* If the receiver is online → send the message instantly using websockets.
      If they're offline → they will get it later from the database.*/

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage); //HTTP 201 = "created successfully".

  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//returns the list of users the logged-in user has chatted with, either as sender or receiver.
export const getChatPartners = async (req, res) => { //Get list of users I have chatted with
  try {
    const loggedInUserId = req.user._id; //Get logged-in user ID

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    /* For every message:
      If I sent the message → the partner is msg.receiverId
      If I received the message → the partner is msg.senderId */

    const chatPartnerIds = [
      ...new Set( //Use Set() to remove duplicates
        messages.map((msg) => 
        msg.senderId.toString() === loggedInUserId.toString()? msg.receiverId.toString(): msg.senderId.toString() //convert them to strings
        )
      ),
    ];
//retrieves all users whose _id is in chatPartnerIds and hide password
    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password"); 

    res.status(200).json(chatPartners); //return the result
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};