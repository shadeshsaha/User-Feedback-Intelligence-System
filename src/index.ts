import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import {
  createFeedback,
  getFeedbacks,
} from "./controllers/feedback.controller.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.post("/api/feedback", createFeedback);
app.get("/api/feedback", getFeedbacks);

// Health Check
app.get("/health", (req, res) => res.send("System Operational"));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("📡 Connected to User Feedback Intelligence System DB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  } catch (err) {
    console.error("Critical System Failure:", err);
  }
};

startServer();
