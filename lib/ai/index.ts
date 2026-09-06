import type { AIOperation, AIProvider } from "./types";
import { buildPrompt } from "./prompts";
import { geminiProvider } from "./providers/gemini";
import { groqProvider } from "./providers/groq";
import { parseAIResponse, type TextChange } from "./parse-response";
import { correctHalfSpaces } from "@/lib/persian/half-space";
import { scoreText, type ReadabilityScore } from "@/lib/persian/readability";

const PROVIDER_CHAIN: AIProvider[] = [geminiProvider, groqProvider];

export interface GenerateTextResult {
  text: string;
  changes: TextChange[];
  scores: { before: ReadabilityScore; after: ReadabilityScore };
  providerId: string;
  providerLabel: string;
  usedFallback: boolean;
}

export async function generateText(
  operation: AIOperation,
  input: string,
): Promise<GenerateTextResult> {
  const prompt = buildPrompt(operation, input);
  const errors: unknown[] = [];

  for (let i = 0; i < PROVIDER_CHAIN.length; i++) {
    const provider = PROVIDER_CHAIN[i];
    try {
      const raw = await provider.generate(prompt);
      const parsed = parseAIResponse(raw);

      let finalText = parsed.text;
      let changes = parsed.changes;

      if (operation === "improve") {
        const halfSpaceResult = correctHalfSpaces(finalText);
        finalText = halfSpaceResult.text;
        changes = [
          ...changes,
          ...halfSpaceResult.changes.map((c) => ({
            before: c.before,
            after: c.after,
            reason: "اصلاح نیم‌فاصله (نیم‌فاصله جا افتاده بود)",
          })),
        ];
      }

      return {
        text: finalText,
        changes,
        scores: { before: scoreText(input), after: scoreText(finalText) },
        providerId: provider.id,
        providerLabel: provider.label,
        usedFallback: i > 0,
      };
    } catch (e) {
      console.error(`[ai] provider "${provider.id}" failed, trying next`, e);
      errors.push(e);
    }
  }

  throw new AggregateError(errors, "All AI providers failed");
}

export { OPERATION_LABELS } from "./prompts";
export type { AIOperation } from "./types";
