import Groq from "groq-sdk";
import type { AIProvider } from "../types";
import { AIProviderError } from "../types";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

export const groqProvider: AIProvider = {
  id: "groq",
  label: "Groq",
  async generate(prompt: string): Promise<string> {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (!text) throw new Error("empty response");
      return text;
    } catch (e) {
      throw new AIProviderError("groq", "Groq generation failed", e);
    }
  },
};
