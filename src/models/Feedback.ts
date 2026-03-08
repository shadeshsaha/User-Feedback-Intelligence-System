import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
  userName: string;
  userEmail: string;
  rawContent: string;
  category: "Bug" | "Feature Request" | "Pricing" | "General";
  priority: "Low" | "Medium" | "High" | "Urgent";
  sentiment: "Positive" | "Neutral" | "Negative";
  assignedTeam: "Engineering" | "Product" | "Sales" | "Support";
  createdAt: Date;
}

const FeedbackSchema = new Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rawContent: { type: String, required: true },
  category: {
    type: String,
    enum: ["Bug", "Feature Request", "Pricing", "General"],
  },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"] },
  sentiment: { type: String, enum: ["Positive", "Neutral", "Negative"] },
  assignedTeam: {
    type: String,
    enum: ["Engineering", "Product", "Sales", "Support"],
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
