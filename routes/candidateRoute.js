import {
  createCandidate,
  deleteCandidate,
  getCandidate,
  getCandidates,
  updateCandidate,
} from "../controller/candidateController.js";

import express from "express";

const router = express.Router();

// Get all candidates
router.get("/", getCandidates);

// Get single candidate
router.get("/:id", getCandidate);

// Create new candidate
router.post("/", createCandidate);

// Update candidate
router.put("/:id", updateCandidate);

// Delete candidate
router.delete("/:id", deleteCandidate);

export default router;
