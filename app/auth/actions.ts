"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; error: string };

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "ایمیل یا رمز عبور اشتباه است.";
  }
  if (message.includes("User already registered")) {
    return "این ایمیل قبلاً ثبت‌نام کرده است.";
  }
  if (message.includes("Password should be at least")) {
    return "رمز عبور باید حداقل ۶ کاراکتر باشد.";
  }
  if (message.includes("rate limit")) {
    return "به دلیل محدودیت ارسال ایمیل، لطفاً چند دقیقه دیگر دوباره تلاش کنید.";
  }
  return "خطایی رخ داد. دوباره تلاش کنید.";
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("[auth] signUp failed:", error.status, error.code, error.message);
    return { ok: false, error: translateAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  // No session yet means email confirmation is still required.
  return { ok: true, needsEmailConfirmation: !data.session };
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("[auth] signIn failed:", error.status, error.code, error.message);
    return { ok: false, error: translateAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  return { ok: true, needsEmailConfirmation: false };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
