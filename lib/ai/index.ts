import type { AIOperation, AIProvider } from "./types";
import { buildPrompt } from "./prompts";
import { geminiProvider } from "./providers/gemini";
import { groqProvider } from "./providers/groq";

const PROVIDER_CHAIN: AIProvider[] = [geminiProvider, groqProvider];

export interface GenerateTextResult {
  text: string;
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
      const text = await provider.generate(prompt);
      return {
        text,
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
