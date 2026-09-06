"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteHistoryItem(id: string) {
  const supabase = await createClient();
  await supabase.from("text_history").delete().eq("id", id);
  revalidatePath("/history");
}
