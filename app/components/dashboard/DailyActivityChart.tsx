"use client";

import { motion } from "motion/react";
import { toPersianDigits } from "@/lib/persian/numerals";

const TRACK_HEIGHT_PX = 112;
const MIN_BAR_PX = 4;
const COLUMN_WIDTH_PX = 42;

export function DailyActivityChart({ days }: { days: { key: string; label: string; count: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-700">متن‌های پردازش‌شده در ۱۴ روز اخیر</h2>
      <div className="mt-5 overflow-x-auto">
        <div
          className="flex items-end gap-1.5"
          style={{ height: TRACK_HEIGHT_PX, minWidth: days.length * COLUMN_WIDTH_PX }}
        >
          {days.map((d, i) => {
            const barPx = Math.max(MIN_BAR_PX, (d.count / max) * TRACK_HEIGHT_PX);
            return (
              <div key={d.key} className="flex shrink-0 flex-col items-center gap-1.5" style={{ width: COLUMN_WIDTH_PX }}>
                <motion.div
                  title={`${d.label}: ${toPersianDigits(d.count)}`}
                  className="w-full rounded-t-sm bg-[#2a78d6]"
                  initial={{ height: 0 }}
                  animate={{ height: barPx }}
                  transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                />
                <span className="whitespace-nowrap text-[10px] text-zinc-400">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
