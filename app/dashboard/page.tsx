import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";

const OPERATION_COLORS: Record<AIOperation, string> = {
  improve: "#2a78d6",
  summarize: "#eb6834",
  "tone-formal": "#1baf7a",
  "tone-informal": "#eda100",
  simplify: "#e87ba4",
};

const OPERATIONS_ORDER = Object.keys(OPERATION_LABELS) as AIOperation[];
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

  const byOperation = new Map<AIOperation, number>();
  for (const op of OPERATIONS_ORDER) byOperation.set(op, 0);
  for (const row of rows) {
    const op = row.operation as AIOperation;
    byOperation.set(op, (byOperation.get(op) ?? 0) + 1);
  }
  const maxOperationCount = Math.max(1, ...byOperation.values());

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
  const maxDayCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div dir="rtl" className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-bold text-zinc-900">داشبورد</h1>
      <p className="mt-1 text-sm text-zinc-500">آمار استفاده شما از دستیار نوشتار.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="کل عملیات‌ها" value={total} />
        <StatTile label="۱۴ روز اخیر" value={days.reduce((s, d) => s + d.count, 0)} />
        <StatTile
          label="پرکاربردترین عملیات"
          value={
            total === 0
              ? "—"
              : OPERATION_LABELS[
                  [...byOperation.entries()].sort((a, b) => b[1] - a[1])[0][0]
                ]
          }
        />
        <StatTile label="امروز" value={days[days.length - 1].count} />
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-700">تفکیک بر اساس نوع عملیات</h2>
        <div className="mt-4 flex flex-col gap-3">
          {OPERATIONS_ORDER.map((op) => {
            const count = byOperation.get(op) ?? 0;
            const widthPct = total === 0 ? 0 : (count / maxOperationCount) * 100;
            return (
              <div key={op} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-zinc-600">{OPERATION_LABELS[op]}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    title={`${OPERATION_LABELS[op]}: ${count}`}
                    className="h-full rounded-full transition-all"
                    style={{ width: `${widthPct}%`, backgroundColor: OPERATION_COLORS[op] }}
                  />
                </div>
                <span className="w-6 shrink-0 text-left text-sm tabular-nums text-zinc-500">{count}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-700">متن‌های پردازش‌شده در ۱۴ روز اخیر</h2>
        <div className="mt-5 flex h-32 items-end gap-1.5">
          {days.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                title={`${d.label}: ${d.count}`}
                className="w-full rounded-t-sm bg-[#2a78d6] transition-all"
                style={{ height: `${Math.max(4, (d.count / maxDayCount) * 100)}%` }}
              />
              <span className="text-[10px] text-zinc-400">{d.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}
