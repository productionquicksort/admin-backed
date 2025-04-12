import mongoose from "mongoose";

// MongoDB connection URI
const MONGODB_URI =
  "mongodb+srv://earnsingh1:aTtyutc2LJR3w5eT@cluster0.7a1dkzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
