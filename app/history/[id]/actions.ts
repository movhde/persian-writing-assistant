"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateText, type AIOperation } from "@/lib/ai";
import { scoreText } from "@/lib/persian/readability";
import type { TextChange } from "@/lib/ai/parse-response";
import type { ReadabilityScore } from "@/lib/persian/readability";

export type UpdateOutputResult = { ok: true } | { ok: false; error: string };

export async function updateHistoryOutput(id: string, outputText: string): Promise<UpdateOutputResult> {
  const supabase = await createClient();
  const trimmed = outputText.trim();
  if (!trimmed) return { ok: false, error: "متن نمی‌تواند خالی باشد." };

  const { error } = await supabase
    .from("text_history")
    .update({ output_text: trimmed, score_after: scoreText(trimmed) })
    .eq("id", id);

  if (error) {
    console.error("[history] failed to update output:", error.code, error.message);
    return { ok: false, error: "ذخیره تغییرات ناموفق بود." };
  }

  revalidatePath(`/history/${id}`);
  return { ok: true };
}

export type RerunResult =
  | { ok: true; text: string; changes: TextChange[]; scoreAfter: ReadabilityScore; providerLabel: string }
  | { ok: false; error: string };

export async function rerunHistoryItem(id: string): Promise<RerunResult> {
  const supabase = await createClient();
  const { data: row, error: fetchError } = await supabase
    .from("text_history")
    .select("input_text, operation")
    .eq("id", id)
    .single();

  if (fetchError || !row) {
    return { ok: false, error: "متن اصلی یافت نشد." };
  }

  try {
    const result = await generateText(row.operation as AIOperation, row.input_text);
    const { error: updateError } = await supabase
      .from("text_history")
      .update({
        output_text: result.text,
        changes: result.changes,
        score_after: result.scores.after,
        provider: result.providerId,
      })
      .eq("id", id);

    if (updateError) {
      console.error("[history] failed to save rerun:", updateError.code, updateError.message);
      return { ok: false, error: "ذخیره نتیجه جدید ناموفق بود." };
    }

    revalidatePath(`/history/${id}`);
    return {
      ok: true,
      text: result.text,
      changes: result.changes,
      scoreAfter: result.scores.after,
      providerLabel: result.providerLabel,
    };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "خطا در ارتباط با سرویس‌های هوش مصنوعی." };
  }
}
