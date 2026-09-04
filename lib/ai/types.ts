export type AIOperation =
  | "improve"
  | "summarize"
  | "tone-formal"
  | "tone-informal"
  | "simplify";

export interface AIProvider {
  id: string;
  label: string;
  generate(prompt: string): Promise<string>;
}

export class AIProviderError extends Error {
  constructor(
    public providerId: string,
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
