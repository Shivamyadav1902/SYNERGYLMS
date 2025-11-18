
import { GoogleGenAI, Chat } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.warn("API_KEY environment variable not set. AI Tutor will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

let chat: Chat | null = null;

export const startAITutorChat = (courseContext: string): void => {
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a helpful and patient AI Tutor for a Learning Management System. 
      Your goal is to help students understand concepts, not just give them answers. 
      You are currently tutoring for the following course context: "${courseContext}". 
      Base your explanations on this context. Be encouraging and break down complex topics into smaller, understandable pieces. 
      If a student asks a question unrelated to the course, gently guide them back to the topic.`,
    },
  });
};

export const sendAITutorMessage = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "I'm sorry, my AI features are currently disabled. Please contact an administrator.";
  }
  
  if (!chat) {
    return "I'm sorry, the chat session hasn't been started. Please select a course first.";
  }
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini API:", error);
    return "I'm sorry, I encountered an error. Please try again in a moment.";
  }
};
