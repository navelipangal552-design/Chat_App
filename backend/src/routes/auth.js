import express from "express"; //used to create routes 
import { signup ,login ,logout,updateProfile} from "../controllers/auth.controllers.js"; //import functions
import { protectRoute } from "../middleware/auth.middleware.js";

//defines all the API routes related to authentication ((signup, login, logout, update profile)
const router = express.Router(); //router acts like a mini express app to organize your routes.

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile", protectRoute ,updateProfile);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router; 
