import express from "express";
const router = express.Router();

// Simple test route
router.get("/test", (req, res) => {
  res.json({ message: "Backend is running successfully 🚀" });
});

export default router;
