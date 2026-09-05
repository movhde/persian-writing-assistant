"use client";

import { motion } from "motion/react";

const DEMO_BEFORE = "من دیروز رفتم مدرسه و خیلی درس خوندم ولی هنوز نفهمیدم چی شد";

export function Hero() {
  return (
    <section dir="rtl" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-gradient-to-b from-violet-100/70 to-transparent"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-16 pb-12 text-center sm:px-6">
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-100">
          پروژه پایانی — نوشتار فارسی با هوش مصنوعی
        </span>

        <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
          نوشتار فارسی‌تان را
          <span className="text-violet-600"> هوشمندانه‌تر </span>
          کنید
        </h1>

        <p className="mt-4 max-w-xl text-balance text-zinc-500">
          بهبود نگارش، خلاصه‌سازی، تغییر لحن و ساده‌سازی متن — همراه با اصلاح خودکار نیم‌فاصله،
          توضیح دلیل هر تغییر، و نمره خوانایی و رسمیت، پیش و پس از هر عملیات.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#editor"
            className="rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-violet-200 transition-colors hover:bg-violet-700"
          >
            همین حالا امتحان کنید
          </a>
          <a
            href="#features"
            className="rounded-full px-6 py-3 text-sm font-medium text-zinc-600 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50"
          >
            امکانات را ببینید
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 text-right shadow-lg shadow-zinc-100"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>نمونه خروجی</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">بهبود نگارش</span>
          </div>
          <p className="mt-3 text-sm leading-8 text-zinc-400 line-through decoration-zinc-300">
            {DEMO_BEFORE}
          </p>
          <p dir="rtl" lang="fa" className="mt-2 text-base leading-8">
            من دیروز <ins className="rounded bg-emerald-100 px-0.5 text-emerald-800 no-underline">به مدرسه رفتم</ins> و{" "}
            <ins className="rounded bg-emerald-100 px-0.5 text-emerald-800 no-underline">بسیار</ins> درس خواندم، اما هنوز
            نفهمیدم <ins className="rounded bg-emerald-100 px-0.5 text-emerald-800 no-underline">چرا</ins>.
          </p>
          <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-3 text-xs text-zinc-400">
            <span>
              خوانایی <span className="font-medium text-violet-600">۷۸</span>
            </span>
            <span>
              رسمیت <span className="font-medium text-violet-600">۹۲</span>
            </span>
            <span className="mr-auto">اصلاح نیم‌فاصله شامل شد</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
