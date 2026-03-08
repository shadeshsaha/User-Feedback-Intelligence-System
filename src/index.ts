// import dotenv from "dotenv";
// dotenv.config();

import "dotenv/config";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import {
  createFeedback,
  getFeedbacks,
} from "./controllers/feedback.controller.js";

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
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is missing");

    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(mongoUri, {
      // These options help with SSL/TLS handshake issues on some networks
      tls: true,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    console.log("📡 Connected to User Feedback Intelligence System DB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  } catch (err: any) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

startServer();
