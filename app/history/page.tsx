import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OPERATION_LABELS } from "@/lib/ai/prompts";
import type { AIOperation } from "@/lib/ai/types";
import { deleteHistoryItem } from "./actions";

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
    <div dir="rtl" className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-bold text-zinc-900">تاریخچه</h1>
      <p className="mt-1 text-sm text-zinc-500">آخرین متن‌هایی که پردازش کرده‌اید.</p>

      {!items || items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-400">
          هنوز متنی پردازش نکرده‌اید. از صفحه اصلی شروع کنید.
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                  {OPERATION_LABELS[item.operation as AIOperation] ?? item.operation}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">{dateFormatter.format(new Date(item.created_at))}</span>
                  <form action={deleteHistoryItem.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="text-xs text-zinc-400 transition-colors hover:text-rose-600"
                    >
                      حذف
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <p className="line-clamp-3 text-sm leading-7 text-zinc-600">{item.input_text}</p>
                <p className="line-clamp-3 text-sm leading-7 text-zinc-900">{item.output_text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
