import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/app/components/auth/AuthForm";
import { AuthCard } from "@/app/components/auth/AuthCard";

export const metadata: Metadata = { title: "ورود — دستیار هوشمند نوشتار فارسی" };

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <AuthCard title="ورود به حساب کاربری">
      <AuthForm mode="login" />
    </AuthCard>
  );
}
