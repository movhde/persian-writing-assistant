"use client";

import { motion } from "motion/react";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";
import { toPersianDigits } from "@/lib/persian/numerals";

const OPERATION_COLORS: Record<AIOperation, string> = {
  improve: "#2a78d6",
  summarize: "#eb6834",
  "tone-formal": "#1baf7a",
  "tone-informal": "#eda100",
  simplify: "#e87ba4",
};

export function OperationBreakdown({ counts }: { counts: Record<AIOperation, number> }) {
  const operations = Object.keys(OPERATION_LABELS) as AIOperation[];
  const max = Math.max(1, ...operations.map((op) => counts[op] ?? 0));

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-700">تفکیک بر اساس نوع عملیات</h2>
      <div className="mt-4 flex flex-col gap-3">
        {operations.map((op, i) => {
          const count = counts[op] ?? 0;
          const widthPct = (count / max) * 100;
          return (
            <div key={op} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm text-zinc-600">{OPERATION_LABELS[op]}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <motion.div
                  title={`${OPERATION_LABELS[op]}: ${toPersianDigits(count)}`}
                  className="h-full rounded-full"
                  style={{ backgroundColor: OPERATION_COLORS[op] }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
                />
              </div>
              <span className="w-6 shrink-0 text-left text-sm tabular-nums text-zinc-500">
                {toPersianDigits(count)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
