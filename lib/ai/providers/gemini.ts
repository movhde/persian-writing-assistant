import { GoogleGenAI } from "@google/genai";
import type { AIProvider } from "../types";
import { AIProviderError } from "../types";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const geminiProvider: AIProvider = {
  id: "gemini",
  label: "Gemini",
  async generate(prompt: string): Promise<string> {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
      });
      const text = response.text?.trim();
      if (!text) throw new Error("empty response");
      return text;
    } catch (e) {
      throw new AIProviderError("gemini", "Gemini generation failed", e);
    }
  },
};
