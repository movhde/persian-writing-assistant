export interface TextChange {
  before: string;
  after: string;
  reason: string;
}

export interface ParsedResponse {
  text: string;
  changes: TextChange[];
}

// Models sometimes wrap JSON in a ```json fence despite instructions not to.
function stripCodeFence(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return fenced ? fenced[1] : raw;
}

// Falls back to the raw text with no explanations if the model didn't return valid JSON.
export function parseAIResponse(raw: string): ParsedResponse {
  const candidate = stripCodeFence(raw.trim());
  try {
    const parsed = JSON.parse(candidate);
    if (typeof parsed.text === "string") {
      const changes: TextChange[] = Array.isArray(parsed.changes)
        ? parsed.changes
            .filter((c: unknown): c is TextChange =>
              typeof c === "object" &&
              c !== null &&
              typeof (c as TextChange).before === "string" &&
              typeof (c as TextChange).after === "string" &&
              typeof (c as TextChange).reason === "string",
            )
        : [];
      return { text: parsed.text, changes };
    }
  } catch {
    // fall through to plain-text fallback
  }
  return { text: raw.trim(), changes: [] };
}
