import Complaint from "../models/complaintModel.js";
import User from "../models/userModel.js";

// 🧾 Create complaint (Student)
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, location, anonymous } = req.body;
    console.log("➡️ createComplaint called. req.body:", req.body);
    console.log("➡️ req.user in createComplaint:", req.user ? { id: req.user._id, email: req.user.email } : null);

    // ✅ 1. Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ 2. Handle attachments
    const attachments = [];
    if (req.files && req.files.length) {
      req.files.forEach((f) => attachments.push(`/uploads/${f.filename}`));
    }

    // ✅ 3. Create complaint
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || "low",
      location: location || "Not specified",
      anonymous: anonymous === "true" || anonymous === true,
      attachments,
      createdBy: req.user._id,
      history: [{ status: "submitted", by: req.user._id }],
    });

    console.log("✅ Complaint successfully created:", complaint._id);
    return res.status(201).json({
      message: "Complaint added successfully",
      complaint,
    });
  } catch (err) {
    console.error("❌ Create Complaint Error:", err.message);
    if (err.name === "ValidationError") {
      // send detailed mongoose validation error
      return res.status(400).json({
        message: err.message,
        details: err.errors,
      });
    }
    return res.status(500).json({ message: "Server error while creating complaint" });
  }
};

// 👤 Student: Get my complaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.json(complaints);
  } catch (err) {
    console.error("Get My Complaints Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🧑‍💼 Admin: Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    return res.json(complaints);
  } catch (err) {
    console.error("Get All Complaints Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔄 Update complaint status (Admin/Staff)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, assignedTo } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (assignedTo) {
      const staff = await User.findById(assignedTo);
      if (staff) complaint.assignedTo = staff._id;
    }

    if (status) {
      complaint.status = status;
      complaint.history.push({ status, by: req.user._id, note });
    }

    await complaint.save();
    return res.json({ message: "Complaint updated successfully", complaint });
  }catch (err) {
  console.error("Create Complaint Error full:", err);
  if (err.name === "ValidationError") {
    console.error("Validation details:", err.errors);
  }
  res.status(500).json({ message: "Server error", error: err.message });
}

};
