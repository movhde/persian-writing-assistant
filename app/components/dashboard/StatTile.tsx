"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { toPersianDigits } from "@/lib/persian/numerals";

export function StatTile({
  label,
  value,
  icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          {icon}
        </span>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-zinc-900">{toPersianDigits(value)}</p>
    </motion.div>
  );
}
