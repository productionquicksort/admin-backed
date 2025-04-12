import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
} from "../controller/employeeController.js";

import { Router } from "express";

const router = Router();

// Define search route first (before any routes with :id parameter)
router.get("/search", searchEmployees);

// Other routes
router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
