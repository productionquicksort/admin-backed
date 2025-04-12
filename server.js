import attendanceRoutes from "./routes/attandanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoute.js";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employeeRoutes.js";
import express from "express";
import fileUpload from "express-fileupload";
import leaveRoutes from "./routes/leaveRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Add file upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
