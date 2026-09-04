"use server";

import { generateText, type AIOperation } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export type RunOperationResult =
  | { ok: true; text: string; providerLabel: string; usedFallback: boolean }
  | { ok: false; error: string };

export async function runTextOperation(
  text: string,
  operation: AIOperation,
): Promise<RunOperationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "متنی برای پردازش وارد نشده است." };
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
      });
      if (historyError) {
        console.error("[history] failed to save operation:", historyError.code, historyError.message);
      }
    }

    return {
      ok: true,
      text: result.text,
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
