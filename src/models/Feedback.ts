import mongoose, { Document, Schema } from "mongoose";
import type {
  AssignedTeam,
  Category,
  Priority,
  Sentiment,
} from "../types/Feedback.ts";

export interface IFeedback extends Document {
  userName: string;
  originalText: string;
  category: Category;
  priority: Priority;
  sentiment: Sentiment;
  assignedTeam: AssignedTeam;
  aiFailover: boolean;
  createdAt: Date;
}

const FeedbackSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    originalText: { type: String, required: true },
    category: {
      type: String,
      enum: ["Bug", "Features", "UI/UX", "Performance", "General"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },
    assignedTeam: {
      type: String,
      enum: [
        "Frontend Team",
        "Backend Team",
        "Design Team",
        "DevOps Team",
        "QA Team",
        "General",
      ],
      default: "General",
    },
    aiFailover: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
