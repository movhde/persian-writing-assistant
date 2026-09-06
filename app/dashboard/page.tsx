import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ListChecks, CalendarClock, Trophy, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";
import { StatTile } from "@/app/components/dashboard/StatTile";
import { OperationBreakdown } from "@/app/components/dashboard/OperationBreakdown";
import { DailyActivityChart } from "@/app/components/dashboard/DailyActivityChart";

export const metadata: Metadata = { title: "داشبورد — دستیار هوشمند نوشتار فارسی" };

const DAYS_WINDOW = 14;

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: items } = await supabase
    .from("text_history")
    .select("operation, created_at")
    .order("created_at", { ascending: false });

  const rows = items ?? [];
  const total = rows.length;

  const byOperation: Record<AIOperation, number> = {
    improve: 0,
    summarize: 0,
    "tone-formal": 0,
    "tone-informal": 0,
    simplify: 0,
  };
  for (const row of rows) {
    const op = row.operation as AIOperation;
    byOperation[op] = (byOperation[op] ?? 0) + 1;
  }

  const today = new Date();
  const days: { key: string; label: string; count: number }[] = [];
  for (let i = DAYS_WINDOW - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      key: dayKey(d),
      label: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "short" }).format(d),
      count: 0,
    });
  }
  const dayIndex = new Map(days.map((d, i) => [d.key, i]));
  for (const row of rows) {
    const key = dayKey(new Date(row.created_at));
    const idx = dayIndex.get(key);
    if (idx !== undefined) days[idx].count += 1;
  }

  const topOperation =
    total === 0
      ? "—"
      : OPERATION_LABELS[
          (Object.entries(byOperation).sort((a, b) => b[1] - a[1])[0][0]) as AIOperation
        ];

  return (
    <div dir="rtl" className="mx-auto w-full max-w-4xl px-4 pt-10 pb-20 sm:px-6">
      <h1 className="text-xl font-bold text-zinc-900">داشبورد</h1>
      <p className="mt-1 text-sm text-zinc-500">آمار استفاده شما از دستیار نوشتار.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="کل عملیات‌ها" value={total} icon={<ListChecks size={16} strokeWidth={2} />} delay={0} />
        <StatTile
          label="۱۴ روز اخیر"
          value={days.reduce((s, d) => s + d.count, 0)}
          icon={<CalendarClock size={16} strokeWidth={2} />}
          delay={0.05}
        />
        <StatTile label="پرکاربردترین عملیات" value={topOperation} icon={<Trophy size={16} strokeWidth={2} />} delay={0.1} />
        <StatTile label="امروز" value={days[days.length - 1].count} icon={<Sparkles size={16} strokeWidth={2} />} delay={0.15} />
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <OperationBreakdown counts={byOperation} />
        <DailyActivityChart days={days} />
      </div>
    </div>
  );
}
