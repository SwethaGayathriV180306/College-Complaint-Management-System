import express from "express";
import multer from "multer";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
} from "../controllers/complaintController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🧍‍♀️ Student creates complaint
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  upload.array("attachments", 5),
  createComplaint
);

// 🧍‍♀️ Student views own complaints
router.get(
  "/me",
  protect,
  authorizeRoles("student"),
  getMyComplaints
);

// 🧑‍💼 Admin views all complaints
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllComplaints
);

// 👷 Staff/Admin updates complaint status
router.put(
  "/:id",
  protect,
  authorizeRoles("staff", "admin"),
  updateComplaintStatus
);

export default router;
