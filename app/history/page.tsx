import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";
import { toPersianDigits } from "@/lib/persian/numerals";
import { HistoryDeleteButton } from "@/app/components/history/HistoryDeleteButton";

export const metadata: Metadata = { title: "تاریخچه — دستیار هوشمند نوشتار فارسی" };

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: items } = await supabase
    .from("text_history")
    .select("id, operation, input_text, output_text, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div dir="rtl" className="mx-auto w-full max-w-4xl px-4 pt-10 pb-20 sm:px-6">
      <h1 className="text-xl font-bold text-zinc-900">تاریخچه</h1>
      <p className="mt-1 text-sm text-zinc-500">آخرین متن‌هایی که پردازش کرده‌اید.</p>

      {!items || items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-400">
          هنوز متنی پردازش نکرده‌اید. از صفحه اصلی شروع کنید.
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 pt-4">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                  {OPERATION_LABELS[item.operation as AIOperation] ?? item.operation}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">
                    {toPersianDigits(dateFormatter.format(new Date(item.created_at)))}
                  </span>
                  <HistoryDeleteButton id={item.id} />
                </div>
              </div>

              <Link href={`/history/${item.id}`} className="block px-4 pb-4 pt-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <p className="line-clamp-3 text-sm leading-7 text-zinc-600">{item.input_text}</p>
                  <p className="line-clamp-3 text-sm leading-7 text-zinc-900">{item.output_text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
