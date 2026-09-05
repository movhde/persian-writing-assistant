"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { TextChange } from "@/lib/ai/parse-response";
import { toPersianDigits } from "@/lib/persian/numerals";

export function ChangesPanel({ changes }: { changes: TextChange[] }) {
  const [open, setOpen] = useState(true);

  if (changes.length === 0) return null;

  return (
    <div dir="rtl" className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-700"
      >
        <span>چرا این تغییرها؟ ({toPersianDigits(changes.length)})</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          ⌄
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {changes.map((change, i) => (
              <li key={i} className="border-t border-zinc-100 px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700 line-through">
                    {change.before}
                  </span>
                  <span className="text-zinc-300">←</span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">
                    {change.after}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{change.reason}</p>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
