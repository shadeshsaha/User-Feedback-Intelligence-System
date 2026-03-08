import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// 1. Validate Environment Variable
const apiKey = process.env.GOOGLE_API_KEY;
console.log("GOOGLE_API_KEY Loaded:", !!apiKey);

if (!apiKey) {
  throw new Error(
    "CRITICAL: GOOGLE_API_KEY is not defined in the environment.",
  );
}

// 2. Define the schema for LLM output
const analysisSchema = z.object({
  category: z.enum(["Bug", "Feature Request", "Pricing", "General"]),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]),
  team: z.enum(["Engineering", "Product", "Sales", "Support"]),
});

const parser = StructuredOutputParser.fromZodSchema(analysisSchema);

// 3. Initialize Model
// Lazy initialization function
const getModel = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("CRITICAL: GOOGLE_API_KEY is still undefined at runtime.");
  }
  return new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    model: "gemini-1.5-flash",
    temperature: 0,
  });
};

export const analyzeFeedbackContent = async (text: string) => {
  // Model is only created when this function is called
  const model = getModel();

  const prompt = new PromptTemplate({
    template:
      "Analyze the feedback and extract structured data.\n{format_instructions}\nFeedback: {feedback}",
    inputVariables: ["feedback"],
    partialVariables: { format_instructions: parser.getFormatInstructions() },
  });

  const input = await prompt.format({ feedback: text });
  const response = await model.invoke(input);
  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);
  return await parser.parse(content);
};
