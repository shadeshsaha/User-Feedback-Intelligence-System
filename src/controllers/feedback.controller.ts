import type { Request, Response } from "express";
import Feedback from "../models/Feedback.js";
import { analyzeFeedbackContent } from "../services/llm.service.js";

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { userName, userEmail, content } = req.body;

    const analysis = await analyzeFeedbackContent(content);

    const feedback = await Feedback.create({
      userName,
      userEmail,
      rawContent: content,
      category: analysis.category,
      priority: analysis.priority,
      sentiment: analysis.sentiment,
      assignedTeam: analysis.team,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Intelligence processing failed." });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { name, category, priority } = req.query;
    const filters: any = {};

    if (name) filters.userName = { $regex: name, $options: "i" };
    if (category) filters.category = category;
    if (priority) filters.priority = priority;

    const data = await Feedback.find(filters).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Data retrieval failed." });
  }
};
