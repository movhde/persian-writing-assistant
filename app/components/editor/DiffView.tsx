"use client";

import { diffArrays } from "diff";
import { motion } from "motion/react";

// diffWords() uses \b/\w, which doesn't recognize Persian letters and fragments mid-word.
function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter((token) => token.length > 0);
}

export function DiffView({ original, revised }: { original: string; revised: string }) {
  const parts = diffArrays(tokenize(original), tokenize(revised));

  return (
    <p dir="rtl" lang="fa" className="whitespace-pre-wrap text-lg leading-9">
      {parts.map((part, i) => {
        const text = part.value.join("");
        const delay = Math.min(i * 0.02, 1);
        if (part.added) {
          return (
            <motion.ins
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.25 }}
              className="rounded bg-emerald-100 px-0.5 text-emerald-800 no-underline"
            >
              {text}
            </motion.ins>
          );
        }
        if (part.removed) {
          return (
            <motion.del
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay, duration: 0.25 }}
              className="rounded bg-rose-100 px-0.5 text-rose-700"
            >
              {text}
            </motion.del>
          );
        }
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay * 0.4, duration: 0.15 }}
          >
            {text}
          </motion.span>
        );
      })}
    </p>
  );
}
