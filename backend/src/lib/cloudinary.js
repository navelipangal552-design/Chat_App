//Cloudinary is a cloud service used to upload, store, and manage images & videos.

/*Cloudinary gives you:
Cloud storage
URL for every uploaded image
Automatic resizing, compression, optimization
Secure delivery*/ 

import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js"; //loads your Cloudinary credentials from .env

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME, //Identifies your Cloudinary account
  api_key: ENV.CLOUDINARY_API_KEY, //Username for API
  api_secret: ENV.CLOUDINARY_API_SECRET, //PASSWORD
});

export default cloudinary; //add other files