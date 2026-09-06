"use server";

import { generateText, type AIOperation } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import type { TextChange } from "@/lib/ai/parse-response";
import type { ReadabilityScore } from "@/lib/persian/readability";
import { MAX_INPUT_LENGTH } from "@/lib/ai/constants";

export type RunOperationResult =
  | {
      ok: true;
      text: string;
      changes: TextChange[];
      scores: { before: ReadabilityScore; after: ReadabilityScore };
      providerLabel: string;
      usedFallback: boolean;
    }
  | { ok: false; error: string };

export async function runTextOperation(
  text: string,
  operation: AIOperation,
): Promise<RunOperationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "متنی برای پردازش وارد نشده است." };
  }
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `متن نباید بیشتر از ${MAX_INPUT_LENGTH} کاراکتر باشد.` };
  }

  try {
    const result = await generateText(operation, trimmed);

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { error: historyError } = await supabase.from("text_history").insert({
        user_id: data.user.id,
        operation,
        input_text: trimmed,
        output_text: result.text,
        provider: result.providerId,
        changes: result.changes,
        score_before: result.scores.before,
        score_after: result.scores.after,
      });
      if (historyError) {
        console.error("[history] failed to save operation:", historyError.code, historyError.message);
      }
    }

    return {
      ok: true,
      text: result.text,
      changes: result.changes,
      scores: result.scores,
      providerLabel: result.providerLabel,
      usedFallback: result.usedFallback,
    };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error: "خطا در ارتباط با سرویس‌های هوش مصنوعی. دوباره تلاش کنید.",
    };
  }
}
