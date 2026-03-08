import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// 1. Validate Environment Variable
const apiKey = process.env.GOOGLE_API_KEY;

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
// We pass apiKey directly as a string now because we've narrowed the type above.
const model = new ChatGoogleGenerativeAI({
  apiKey: apiKey,
  model: "gemini-1.5-flash",
  temperature: 0,
});

export const analyzeFeedbackContent = async (text: string) => {
  const prompt = new PromptTemplate({
    template:
      "Analyze the following user feedback and extract structured information.\n{format_instructions}\nFeedback: {feedback}",
    inputVariables: ["feedback"],
    partialVariables: { format_instructions: parser.getFormatInstructions() },
  });

  try {
    const input = await prompt.format({ feedback: text });
    const response = await model.invoke(input);

    // LangChain 0.2+ returns response.content as string | BaseMessage[]
    const content =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return await parser.parse(content);
  } catch (err) {
    console.error("LLM Analysis Error:", err);
    // Fallback object to keep the system running if AI fails
    return {
      category: "General" as const,
      priority: "Medium" as const,
      sentiment: "Neutral" as const,
      team: "Support" as const,
    };
  }
};
