"use client";

import { motion } from "motion/react";
import type { ReadabilityScore } from "@/lib/persian/readability";
import { toPersianDigits } from "@/lib/persian/numerals";

function Bar({ label, before, after }: { label: string; before: number; after: number }) {
  const delta = after - before;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span className={delta === 0 ? "text-zinc-400" : delta > 0 ? "text-emerald-600" : "text-rose-600"}>
          {delta === 0 ? "بدون تغییر" : delta > 0 ? `+${toPersianDigits(delta)}‎` : `${toPersianDigits(delta)}‎`}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-zinc-100">
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full bg-zinc-300"
          initial={{ width: "0%" }}
          animate={{ width: `${before}%` }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full bg-violet-500"
          initial={{ width: "0%" }}
          animate={{ width: `${after}%` }}
          transition={{ duration: 0.6, delay: 0.15 }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-zinc-400">
        <span>{toPersianDigits(before)}</span>
        <span className="font-medium text-violet-600">{toPersianDigits(after)}</span>
      </div>
    </div>
  );
}

export function ScoreCompare({ before, after }: { before: ReadabilityScore; after: ReadabilityScore }) {
  return (
    <div dir="rtl" className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <Bar label="خوانایی" before={before.readability} after={after.readability} />
      <Bar label="رسمیت" before={before.formality} after={after.formality} />
    </div>
  );
}
