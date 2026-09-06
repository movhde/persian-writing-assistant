"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { runTextOperation } from "@/app/actions/text-operations";
import { MAX_INPUT_LENGTH } from "@/lib/ai/constants";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";
import type { TextChange } from "@/lib/ai/parse-response";
import type { ReadabilityScore } from "@/lib/persian/readability";
import { toPersianDigits } from "@/lib/persian/numerals";
import { DiffView } from "./DiffView";
import { ScoreCompare } from "./ScoreCompare";
import { ChangesPanel } from "./ChangesPanel";

const OPERATIONS = Object.keys(OPERATION_LABELS) as AIOperation[];

type ViewMode = "diff" | "side-by-side";

interface OperationResult {
  text: string;
  submittedText: string;
  changes: TextChange[];
  scores: { before: ReadabilityScore; after: ReadabilityScore };
  providerLabel: string;
  usedFallback: boolean;
}

export function WritingEditor() {
  const [operation, setOperation] = useState<AIOperation>("improve");
  const [text, setText] = useState("");
  const [result, setResult] = useState<OperationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("diff");
  const [isPending, startTransition] = useTransition();

  function handleRun() {
    setError(null);
    startTransition(async () => {
      const response = await runTextOperation(text, operation);
      if (response.ok) {
        setResult({
          text: response.text,
          submittedText: text,
          changes: response.changes,
          scores: response.scores,
          providerLabel: response.providerLabel,
          usedFallback: response.usedFallback,
        });
      } else {
        setResult(null);
        setError(response.error);
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pt-10 pb-20 sm:px-6">
      <div dir="rtl" className="flex flex-wrap gap-2">
        {OPERATIONS.map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperation(op)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              operation === op
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-100"
            }`}
          >
            {OPERATION_LABELS[op]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          id="editor"
          dir="rtl"
          lang="fa"
          rows={8}
          value={text}
          maxLength={MAX_INPUT_LENGTH}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن فارسی خود را اینجا بنویسید یا paste کنید..."
          className="w-full resize-y rounded-2xl border border-zinc-200 bg-white p-4 text-lg leading-8 shadow-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <span dir="rtl" className="self-start text-xs text-zinc-400">
          {toPersianDigits(text.length)} / {toPersianDigits(MAX_INPUT_LENGTH)}
        </span>
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={isPending || !text.trim()}
        className="self-start rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {isPending ? "در حال پردازش..." : OPERATION_LABELS[operation]}
      </button>

      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4"
          >
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p dir="rtl" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {result && !isPending && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4"
        >
          <ScoreCompare before={result.scores.before} after={result.scores.after} />

          <div dir="rtl" className="flex items-center justify-between">
            <div className="flex gap-1 rounded-full bg-zinc-100 p-1 text-sm">
              <button
                type="button"
                onClick={() => setViewMode("diff")}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  viewMode === "diff" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"
                }`}
              >
                تفاوت‌ها
              </button>
              <button
                type="button"
                onClick={() => setViewMode("side-by-side")}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  viewMode === "side-by-side" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"
                }`}
              >
                کنار هم
              </button>
            </div>

            <span className="text-xs text-zinc-400">
              {result.usedFallback
                ? `پاسخ از سرویس پشتیبان (${result.providerLabel})`
                : `پاسخ از ${result.providerLabel}`}
            </span>
          </div>

          {viewMode === "diff" ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <DiffView original={result.submittedText} revised={result.text} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <h2 dir="rtl" className="text-sm font-medium text-zinc-500">
                  متن اصلی
                </h2>
                <p
                  dir="rtl"
                  lang="fa"
                  className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-white p-4 text-lg leading-8 shadow-sm"
                >
                  {result.submittedText}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 dir="rtl" className="text-sm font-medium text-zinc-500">
                  نتیجه
                </h2>
                <p
                  dir="rtl"
                  lang="fa"
                  className="whitespace-pre-wrap rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-lg leading-8 shadow-sm"
                >
                  {result.text}
                </p>
              </div>
            </div>
          )}

          <ChangesPanel changes={result.changes} />
        </motion.div>
      )}
    </div>
  );
}
