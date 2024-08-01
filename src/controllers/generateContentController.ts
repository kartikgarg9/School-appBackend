import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../config/env"; // Adjust the path if necessary

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

// Get the generative model with configuration
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig,
});

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Assuming result.response is a readable stream or a similar structure
    // Convert the response to text
    const responseText = await result.response.text();

    return responseText;
  } catch (error) {
    console.error("Error generating content:", error);

    // Return a more specific error message or rethrow as needed
    throw new Error("Failed to generate content: " + (error as Error).message);
  }
};
