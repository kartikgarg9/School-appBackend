// src/controllers/homeworkController.ts
import { generateContent } from "./generateContentController";

export const answerQuestion = async (
  question: string,
  homeworkText: string
): Promise<string> => {
  const prompt = `Given the homework text: "${homeworkText}", answer the following question: ${question}`;
  const generatedContent = await generateContent(prompt);
  console.log({
    question,
    generatedContent,
    createdAt: new Date(),
  });

  return generatedContent;
};
