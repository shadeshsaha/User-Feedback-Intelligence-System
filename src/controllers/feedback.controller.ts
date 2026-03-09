import type { Request, Response } from "express";
import Feedback from "../models/Feedback.js";
import { analyzeFeedbackContent } from "../services/llm.service.js";

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { userName, content } = req.body;

    if (!content || !userName) {
      return res.status(400).json({ error: "Name and content required" });
    }

    const { analysis, aiFailover } = await analyzeFeedbackContent(content);

    const feedback = await Feedback.create({
      userName,
      originalText: content,
      ...analysis,
      aiFailover,
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const data = (await Feedback.find().sort({ createdAt: -1 })) || [];
    res.json({ success: true, data });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, error: "Data retrieval failed" });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedItem = await Feedback.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: "Feedback entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Delete failed",
    });
  }
};
