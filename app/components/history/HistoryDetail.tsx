"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";
import type { TextChange } from "@/lib/ai/parse-response";
import type { ReadabilityScore } from "@/lib/persian/readability";
import { toPersianDigits } from "@/lib/persian/numerals";
import { DiffView } from "@/app/components/editor/DiffView";
import { ScoreCompare } from "@/app/components/editor/ScoreCompare";
import { ChangesPanel } from "@/app/components/editor/ChangesPanel";
import { ConfirmButton } from "@/app/components/ui/ConfirmButton";
import { deleteHistoryItem } from "@/app/history/actions";
import { updateHistoryOutput, rerunHistoryItem } from "@/app/history/[id]/actions";

const dateFormatter = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" });

interface HistoryItem {
  id: string;
  operation: string;
  input_text: string;
  output_text: string;
  provider: string;
  changes: TextChange[];
  score_before: ReadabilityScore | null;
  score_after: ReadabilityScore | null;
  created_at: string;
}

export function HistoryDetail({ item }: { item: HistoryItem }) {
  const router = useRouter();
  const [outputText, setOutputText] = useState(item.output_text);
  const [changes, setChanges] = useState(item.changes);
  const [scoreAfter, setScoreAfter] = useState(item.score_after);
  const [providerLabel, setProviderLabel] = useState(item.provider);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(item.output_text);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isRerunning, startRerunning] = useTransition();

  function handleSave() {
    setError(null);
    startSaving(async () => {
      const result = await updateHistoryOutput(item.id, draft);
      if (result.ok) {
        setOutputText(draft.trim());
        setIsEditing(false);
      } else {
        setError(result.error);
      }
    });
  }

  function handleRerun() {
    setError(null);
    startRerunning(async () => {
      const result = await rerunHistoryItem(item.id);
      if (result.ok) {
        setOutputText(result.text);
        setDraft(result.text);
        setChanges(result.changes);
        setScoreAfter(result.scoreAfter);
        setProviderLabel(result.providerLabel);
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete() {
    return deleteHistoryItem(item.id).then(() => {
      router.push("/history");
    });
  }

  return (
    <div dir="rtl" className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/history" className="text-sm text-zinc-400 hover:text-zinc-700">
        ← بازگشت به تاریخچه
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            {OPERATION_LABELS[item.operation as AIOperation] ?? item.operation}
          </span>
          <span className="text-xs text-zinc-400">
            {toPersianDigits(dateFormatter.format(new Date(item.created_at)))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRerun}
            disabled={isRerunning}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 disabled:opacity-60"
          >
            {isRerunning ? "در حال اجرا..." : "اجرای دوباره"}
          </button>
          <ConfirmButton
            onConfirm={handleDelete}
            triggerLabel="حذف"
            triggerClassName="rounded-full px-4 py-1.5 text-sm font-medium text-rose-600 ring-1 ring-rose-100 transition-colors hover:bg-rose-50"
            title="حذف این مورد؟"
            description="این عملیات قابل بازگشت نیست. متن اصلی و نتیجه برای همیشه حذف می‌شوند."
          />
        </div>
      </div>

      {error && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      {scoreAfter && item.score_before && (
        <div className="mt-4">
          <ScoreCompare before={item.score_before} after={scoreAfter} />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-zinc-500">متن اصلی</h2>
          <p className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-white p-4 text-base leading-8 shadow-sm">
            {item.input_text}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-500">نتیجه</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setDraft(outputText);
                  setIsEditing(true);
                }}
                className="text-xs text-violet-600 hover:underline"
              >
                ویرایش
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-violet-200 bg-white p-4 text-base leading-8 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !draft.trim()}
                  className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-base leading-8 shadow-sm">
              {outputText}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-700">تفاوت‌ها</h2>
        <div className="mt-3">
          <DiffView original={item.input_text} revised={outputText} />
        </div>
      </div>

      {changes.length > 0 && (
        <div className="mt-4">
          <ChangesPanel changes={changes} />
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-400">پاسخ از {providerLabel}</p>
    </div>
  );
}
