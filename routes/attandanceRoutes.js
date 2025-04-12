import {
  getAllAttendance,
  updateAttendance,
} from "../controller/attandanceController.js";

import express from "express";

const router = express.Router();

router.get("/", getAllAttendance);
router.put("/update", updateAttendance);

export default router;
