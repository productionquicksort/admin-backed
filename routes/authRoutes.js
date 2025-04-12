import { login, logout, signup } from "../controller/authController.js";

import express from "express";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
