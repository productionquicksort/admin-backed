import Leave from "../modals/leavesModal.js";
import cloudinary from "../config /cloudinary.js";
// Create new leave request
export const createLeave = async (req, res) => {
  try {
    let documentUrl = null;

    // Upload document to Cloudinary if it exists
    if (req.body.documents) {
      const uploadResponse = await cloudinary.uploader.upload(
        req.body.documents,
        {
          folder: "leaves_documents",
          resource_type: "auto",
          allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
        }
      );
      documentUrl = uploadResponse.secure_url;
    }

    const newLeave = new Leave({
      employee: req.body.employee,
      name: req.body.name,
      profile: req.body.profile,
      designation: req.body.designation,
      date: req.body.date,
      reason: req.body.reason,
      documents: documentUrl, // Save Cloudinary URL instead of raw document
      status: "Pending",
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change status of leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("employee");

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get approved leaves
export const getApprovedLeaves = async (req, res) => {
  try {
    const approvedLeaves = await Leave.find({ status: "Approved" }).populate(
      "employee"
    );
    res.status(200).json(approvedLeaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
