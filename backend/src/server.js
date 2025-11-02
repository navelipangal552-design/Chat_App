//build a basic API

//const express = require('express'); // we require it from express package

import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import path from "path";


dotenv.config(); // load .env variables
const app = express(); //get an app instance form express
const _dirname = path.resolve();

const PORT = process.env.PORT;

// app.get("/api/auth/signup",(req,res) => {
//     res.send("Signup point");
// })

app.use("/api/auth",authRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"../frontend/dist")))

    app.get("*",(req,res) => {
        res.sendFile(path.join(_dirname,"../frontend","dist","index.html"));
    })
}
app.listen(3000,() => console.log("Server running on port 3000:"+ PORT));


