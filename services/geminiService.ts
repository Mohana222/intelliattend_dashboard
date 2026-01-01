
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DataRecord } from "../types";

// Declare process globally to satisfy TypeScript compiler during build (Vercel/Vite)
declare const process: {
  env: {
    API_KEY: string;
  };
};

export const getSmartOverview = async (data: DataRecord[], contextTitle: string): Promise<string> => {
  if (!data.length) return "No data provided for analysis.";
  
  try {
    // Initializing the Gemini API client using the environment variable directly as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Selecting a sample of records to stay within context window while providing enough information.
    const sample = data.slice(0, 30);
    const headers = Object.keys(data[0]);

    const prompt = `
      You are a world-class business intelligence analyst. 
      Analyze the following data from the module: "${contextTitle}".
      
      Detected columns: ${headers.join(', ')}.
      
      Sample Data:
      ${JSON.stringify(sample)}
      
      Tasks:
      1. Provide a concise executive overview (3-4 sentences).
      2. Identify the most critical trend or statistical outlier.
      3. Suggest 2 actionable improvements for the business based on this specific data set.
      
      Format the output in clean Markdown with bold headers. If the data looks like placeholder or nonsensical values, provide a professional but cautious summary.
    `;

    // Using gemini-3-pro-preview for advanced business intelligence analysis as per guidelines.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        temperature: 0.4,
        topK: 64,
        topP: 0.95,
      },
    });

    // Accessing the .text property directly from GenerateContentResponse as per documentation.
    return response.text || "Insight successfully generated. (No text returned by engine)";
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "The AI Intelligence engine is currently processing a high volume of requests. Please try again in a moment.";
  }
};
