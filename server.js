import attendanceRoutes from "./routes/attandanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoute.js";
import connectDB from "./config /db.js";
import cors from "cors";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employeeRoutes.js";
import express from "express";
import leaveRoutes from "./routes/leaveRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Mount auth routes
app.use("/api/auth", authRoutes);

// Mount candidate routes
app.use("/api/candidates", candidateRoutes);

// Mount employee routes
app.use("/api/employees", employeeRoutes);

// Mount attendance routes
app.use("/api/attendance", attendanceRoutes);

// Mount leave routes
app.use("/api/leave", leaveRoutes);

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
