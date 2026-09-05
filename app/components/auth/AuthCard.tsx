"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Logo } from "@/app/components/ui/Logo";

export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-gradient-to-b from-violet-100/70 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg shadow-zinc-100"
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo size={44} />
          <h1 dir="rtl" className="text-xl font-semibold text-zinc-900">
            {title}
          </h1>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
