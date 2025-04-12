import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    status: {
      type: String,
      type: String,
      default: "New",
    },
    resume: {
      type: String,
      default: null,
    },
    experience: {
      type: Number,
      default: 0,
    },
    agreement: {
      type: Boolean,
      required: [true, "Agreement is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
