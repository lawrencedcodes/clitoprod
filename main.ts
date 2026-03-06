import { startFlowServer } from "@genkit-ai/express";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const ai = genkit({
  plugins: [googleAI()],
  model: "gemini-2.5-flash",
});

export const submitReviewTool = ai.defineTool(
  {
    name: "submitReview",
    description: "Submit the final code review to the database.",
    inputSchema: z.object({
      severityScore: z.number().min(1).max(10),
      isApproved: z.boolean(),
      vulnerabilities: z.array(z.string()),
    }),
  },
  async (input) => {
    console.log("Saving strictly formatted data to DB: ", input);
    return { status: "Success", dbId: 101 };
  },
);

async function runReview(code: string) {
  const response = await ai.generate({
    prompt: `Review this code: ${code}`,
    tools: [submitReviewTool],
  });
  console.log(response.text);
}

startFlowServer();
