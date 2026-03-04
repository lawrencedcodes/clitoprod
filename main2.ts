import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { startFlowServer } from "@genkit-ai/express";

// Initialize the framework
const ai = genkit({
  plugins: [googleAI()],
  // 1. Use the fully-qualified namespace string to avoid import errors!
  model: 'googleai/gemini-2.5-flash', 
});

// 2. Define the boundary (The Tool)
export const submitReviewTool = ai.defineTool(
  {
    name: "submitReview",
    description: "Submit the final code review to the database.",
    inputSchema: z.object({
      severityScore: z.number().min(1).max(10),
      isApproved: z.boolean(),
      vulnerabilities: z.array(z.string())
    }),
  },
  async (input) => {
    console.log("Saving strictly formatted data to DB: ", input);
    return { status: "Success", dbId: 101 };
  }
);

// 3. Register the Flow for the Developer UI
export const codeReviewFlow = ai.defineFlow(
  {
    name: "codeReviewFlow",
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (code) => {
    const response = await ai.generate({
      // 4. No model declaration needed here! It inherits the secure default from above.
      prompt: `Review this code for security vulnerabilities. Use the submitReview tool to save your findings: \n\n${code}`,
      tools: [submitReviewTool],
    });
    return response.text;
  }
);

// 4. Start the flow server so the Dev UI can discover and execute it
startFlowServer({
  flows: [codeReviewFlow]
});
