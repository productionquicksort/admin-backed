import {
  createLeave,
  getAllLeaves,
  getApprovedLeaves,
  updateLeaveStatus,
} from "../controller/leaveController.js";

import express from "express";
import upload from "../middleware/multerConfig.js";

const router = express.Router();

// Create new leave request with document upload
router.post("/create", upload.single("documents"), createLeave);

// Get all leaves
router.get("/all", getAllLeaves);

// Update leave status
router.patch("/status/:id", updateLeaveStatus);

// Get approved leaves
router.get("/approved", getApprovedLeaves);

export default router;
