import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/app/components/auth/AuthForm";
import { AuthCard } from "@/app/components/auth/AuthCard";

export const metadata: Metadata = { title: "ثبت‌نام — دستیار هوشمند نوشتار فارسی" };

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <AuthCard title="ساخت حساب کاربری">
      <AuthForm mode="signup" />
    </AuthCard>
  );
}
