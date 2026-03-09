import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import type { FeedbackAnalysis } from "../types/Feedback.js";

const analysisSchema = z.object({
  category: z.enum(["Bug", "Features", "UI/UX", "Performance", "General"]),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]),
  assignedTeam: z.enum([
    "Frontend Team",
    "Backend Team",
    "Design Team",
    "DevOps Team",
    "QA Team",
    "General",
  ]),
});

const parser = StructuredOutputParser.fromZodSchema(analysisSchema);

const getModel = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY is missing");

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: apiKey,
    temperature: 0.1,
    maxOutputTokens: 1024,
    apiVersion: "v1",
  });
};

export const analyzeFeedbackContent = async (text: string) => {
  try {
    const model = getModel();
    const prompt = new PromptTemplate({
      template:
        "You are a senior analyst triaging feedback.\n{format_instructions}\nFeedback: {feedback}",
      inputVariables: ["feedback"],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const chain = RunnableSequence.from([
      prompt,
      model,
      (res) =>
        typeof res.content === "string"
          ? res.content
          : JSON.stringify(res.content),
      parser,
    ]);

    const result = await chain.invoke({ feedback: text });
    return { analysis: result as FeedbackAnalysis, aiFailover: false };
  } catch (error) {
    console.error("AI Analysis failed, using fallbacks:", error);
    return {
      analysis: {
        category: "General",
        priority: "Medium",
        sentiment: "Neutral",
        assignedTeam: "General",
      } as FeedbackAnalysis,
      aiFailover: true,
    };
  }
};
