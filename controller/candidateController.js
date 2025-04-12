import Attendance from "../modals/attendanceModal.js";
import Candidate from "../modals/candiadateModal.js";
import Employee from "../modals/employesModal.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Get all candidates
const getCandidates = async (req, res) => {
  try {
    const { status, position, search } = req.query;
    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by position if provided
    if (position) {
      query.position = position;
    }

    // Search by name or email if search term provided
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get single candidate by ID
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const createCandidate = async (req, res) => {
  try {
    const candidateData = { ...req.body };

    if (req.file) {
      try {
        const result = await cloudinary.uploader
          .upload_stream(
            {
              folder: "resumes",
              resource_type: "raw",
              allowed_formats: ["pdf", "doc", "docx"],
            },
            (error, result) => {
              if (error) {
                return res.status(400).json({
                  success: false,
                  message: "Resume upload failed",
                  error: error.message,
                });
              }

              // Add resume details to candidate data
              candidateData.resume = {
                url: result.secure_url,
                public_id: result.public_id,
                originalName: req.file.originalname,
              };
              // Create candidate after successful upload
              Candidate.create(candidateData)
                .then((candidate) => {
                  res.status(201).json({
                    success: true,
                    data: candidate,
                  });
                })
                .catch((error) => {
                  if (error.code === 11000) {
                    return res.status(400).json({
                      success: false,
                      message: "Email already exists",
                    });
                  }
                  res.status(400).json({
                    success: false,
                    message: error.message,
                  });
                });
            }
          )
          .end(req.file.buffer);
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Resume upload failed",
          error: uploadError.message,
        });
      }
    } else {
      // Create candidate without resume
      const candidate = await Candidate.create(candidateData);
      res.status(201).json({
        success: true,
        data: candidate,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // If candidate status is changed to "selected", create employee and attendance record
    if (req.body.status === "Selected") {
      // Map the position to match employee schema enum values
      let mappedPosition;
      switch (candidate.position.toLowerCase()) {
        case "dse":
        case "sales":
          mappedPosition = "Junior";
          break;
        case "senior":
          mappedPosition = "Senior";
          break;
        case "lead":
          mappedPosition = "Team Lead";
          break;
        default:
          mappedPosition = "Full Time";
      }

      const employeeData = {
        fullName: candidate.fullName || candidate.name,
        email: candidate.email,
        phoneNumber: candidate.phoneNumber || candidate.phone,
        department: candidate.department || "To be assigned",
        position: mappedPosition,
        dateOfJoining: new Date(),
        status: "active",
      };

      try {
        const newEmployee = await Employee.create(employeeData);
        console.log("Employee created successfully:", newEmployee);

        // Create attendance record for the new employee
        const attendanceData = {
          employeeId: newEmployee._id,
          date: new Date(),
          checkIn: new Date(),
          status: "Present",
          task: "New Employee Onboarding",
        };

        const attendance = await Attendance.create(attendanceData);
        console.log("Attendance record created successfully:", attendance);
      } catch (error) {
        console.error(
          "Failed to create employee or attendance record:",
          error.message
        );
        return res.status(400).json({
          success: false,
          message: "Failed to create employee or attendance record",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
};
