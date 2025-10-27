import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// (Optional) implement send-otp & verify-otp endpoints here if you want OTP flow

export default router;
