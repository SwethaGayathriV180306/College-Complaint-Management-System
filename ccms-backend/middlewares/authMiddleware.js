import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    console.log("➡️ protect middleware called. Authorization header:", req.headers.authorization);
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("➡️ token extracted:", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("➡️ token decoded:", decoded);
      req.user = await User.findById(decoded.id).select("-password");
      console.log("➡️ user loaded:", req.user ? { id: req.user._id, email: req.user.email } : null);
      return next();
    } else {
      console.log("⛔ No Bearer token found");
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Not authorized, token failed", error: err.message });
  }
};
