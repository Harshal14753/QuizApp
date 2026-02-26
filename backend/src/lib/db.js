import mongoose from "mongoose";
import ENV from "./env.js";

async function connectToDatabase() {
  try {
    console.log("MONGO_URI:", ENV.MONGO_URI); // Debug log
    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✓ Connected to MongoDB");
  } catch (err) {
    console.error("✗ Error connecting to MongoDB:", err.message);
    throw err;
  }
}

export default connectToDatabase;
