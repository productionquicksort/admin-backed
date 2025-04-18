import Leave from "../modals/leavesModal.js";
import cloudinary from "../config/cloudinary.js";

export const createLeave = async (req, res) => {
  try {
    let documentUrl = null;
    if (req.file) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: "leaves_documents",
          resource_type: "auto",
        });

        documentUrl = {
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
          originalName: req.file.originalname,
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({ message: "File upload failed" });
      }
    }

    const newLeave = new Leave({
      employee: req.body.employee,
      name: req.body.name,
      profile: req.body.profile,
      designation: req.body.designation,
      date: req.body.date,
      reason: req.body.reason,
      documents: documentUrl,
      status: "Pending",
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    console.error("Leave creation error:", error);
    res.status(500).json({ message: "Failed to create leave request" });
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
