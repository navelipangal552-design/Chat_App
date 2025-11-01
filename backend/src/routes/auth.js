import express from "express";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("Signup point");
});

export default router; 
