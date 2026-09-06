"use client";

import { motion } from "motion/react";
import { PenLine, PuzzleIcon, Lightbulb, Gauge, RefreshCw, History, type LucideIcon } from "lucide-react";

const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "پنج عملیات هوشمند",
    description: "بهبود نگارش، خلاصه‌سازی، لحن رسمی/غیررسمی و ساده‌سازی — همه در یک ویرایشگر.",
    icon: PenLine,
  },
  {
    title: "اصلاح نیم‌فاصله",
    description: "قانون‌های اختصاصی برای اصلاح خودکار نیم‌فاصله در پیشوندها و پسوندهای فارسی — نه فقط حدس هوش مصنوعی.",
    icon: PuzzleIcon,
  },
  {
    title: "دلیل هر تغییر",
    description: "هر تغییر معنادار با یک توضیح کوتاه همراه است، برای یادگیری نه فقط اصلاح.",
    icon: Lightbulb,
  },
  {
    title: "نمره خوانایی و رسمیت",
    description: "پیش و پس از هر عملیات، خوانایی و رسمیت متن با یک فرمول قابل توضیح اندازه‌گیری می‌شود.",
    icon: Gauge,
  },
  {
    title: "دو سرویس هوش مصنوعی",
    description: "Gemini به‌صورت اصلی و Groq به‌عنوان پشتیبان — قطعی یک سرویس مانع کار نمی‌شود.",
    icon: RefreshCw,
  },
  {
    title: "تاریخچه و داشبورد",
    description: "همه عملیات‌های شما ذخیره و آمار استفاده در یک داشبورد نمایش داده می‌شود.",
    icon: History,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" dir="rtl" className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h2 className="text-center text-xl font-bold text-zinc-900">همه‌چیز برای نوشتار بهتر</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <f.icon size={20} strokeWidth={2} />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-zinc-900">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-zinc-500">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
