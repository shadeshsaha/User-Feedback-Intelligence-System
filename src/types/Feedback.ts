export type Category = "Bug" | "Features" | "UI/UX" | "Performance" | "General";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Sentiment = "Positive" | "Neutral" | "Negative";
export type AssignedTeam =
  | "Frontend Team"
  | "Backend Team"
  | "Design Team"
  | "DevOps Team"
  | "QA Team"
  | "General";

export interface FeedbackAnalysis {
  category: Category;
  priority: Priority;
  sentiment: Sentiment;
  assignedTeam: AssignedTeam;
}
