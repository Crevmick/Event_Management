// db.js (fixed)
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected!...");
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

export default connectDB;
