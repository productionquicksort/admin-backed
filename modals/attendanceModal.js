import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Medical Leave", "Work from Home"],
      default: "Present",
    },
    task: {
      type: String,
      default: "--",
    },
    workHours: {
      type: Number,
      default: 0,
    },
    comments: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique attendance per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
