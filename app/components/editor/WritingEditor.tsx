"use client";

import { useState, useTransition } from "react";
import { runTextOperation } from "@/app/actions/text-operations";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";
import { DiffView } from "./DiffView";

const OPERATIONS = Object.keys(OPERATION_LABELS) as AIOperation[];

type ViewMode = "diff" | "side-by-side";

export function WritingEditor() {
  const [operation, setOperation] = useState<AIOperation>("improve");
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [providerLabel, setProviderLabel] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("diff");
  const [isPending, startTransition] = useTransition();

  function handleRun() {
    setError(null);
    startTransition(async () => {
      const response = await runTextOperation(text, operation);
      if (response.ok) {
        setResult(response.text);
        setSubmittedText(text);
        setProviderLabel(response.providerLabel);
        setUsedFallback(response.usedFallback);
      } else {
        setResult(null);
        setError(response.error);
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
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
          onChange={(e) => setText(e.target.value)}
          placeholder="متن فارسی خود را اینجا بنویسید یا paste کنید..."
          className="w-full resize-y rounded-2xl border border-zinc-200 bg-white p-4 text-lg leading-8 shadow-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={isPending || !text.trim()}
        className="self-start rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {isPending ? "در حال پردازش..." : OPERATION_LABELS[operation]}
      </button>

      {isPending && (
        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-100 bg-white p-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
        </div>
      )}

      {error && (
        <p dir="rtl" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {result && !isPending && (
        <div className="flex flex-col gap-3">
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

            {providerLabel && (
              <span className="text-xs text-zinc-400">
                {usedFallback
                  ? `پاسخ از سرویس پشتیبان (${providerLabel})`
                  : `پاسخ از ${providerLabel}`}
              </span>
            )}
          </div>

          {viewMode === "diff" ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <DiffView original={submittedText} revised={result} />
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
                  {submittedText}
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
                  {result}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
