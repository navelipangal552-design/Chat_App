//build a basic API

//const express = require('express'); // we require it from express package

import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";


dotenv.config(); // load .env variables
const app = express(); //get an app instance form express

const PORT = process.env.PORT;

// app.get("/api/auth/signup",(req,res) => {
//     res.send("Signup point");
// })

app.use("api/auth",authRoutes);
app.listen(3000,() => console.log("Server running on port 3000:"+ PORT));


