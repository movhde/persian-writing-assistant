"use client";

import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/app/components/ui/ConfirmButton";
import { deleteHistoryItem } from "@/app/history/actions";

export function HistoryDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <ConfirmButton
      onConfirm={async () => {
        await deleteHistoryItem(id);
        router.refresh();
      }}
      triggerLabel="حذف"
      triggerClassName="text-xs text-zinc-400 transition-colors hover:text-rose-600"
      title="حذف این مورد؟"
      description="این عملیات قابل بازگشت نیست. متن اصلی و نتیجه برای همیشه حذف می‌شوند."
    />
  );
}
