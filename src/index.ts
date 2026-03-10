// import dotenv from "dotenv";
// dotenv.config();

import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import {
  createFeedback,
  deleteFeedback,
  getFeedbacks,
} from "./controllers/feedback.controller.js";

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Routes
app.post("/api/createFeedback", createFeedback);
app.get("/api/getFeedbacks", getFeedbacks);
app.delete("/api/deleteFeedback/:id", deleteFeedback);

// Health Check
app.get("/health", (req, res) => res.send("System Operational"));

const nexusAIServer = async () => {
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

nexusAIServer();
