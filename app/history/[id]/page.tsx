import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HistoryDetail } from "@/app/components/history/HistoryDetail";

export const metadata: Metadata = { title: "جزئیات تاریخچه — دستیار هوشمند نوشتار فارسی" };

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: item } = await supabase
    .from("text_history")
    .select("id, operation, input_text, output_text, provider, changes, score_before, score_after, created_at")
    .eq("id", id)
    .single();

  if (!item) notFound();

  return <HistoryDetail item={item} />;
}
