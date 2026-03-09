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
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: "Data retrieval failed" });
  }
};
