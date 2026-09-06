"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import { signIn, signUp } from "@/app/auth/actions";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const action = mode === "login" ? signIn : signUp;
      const result = await action(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (mode === "signup" && result.needsEmailConfirmation) {
        setSignedUp(true);
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  if (signedUp) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        dir="rtl"
        className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center text-emerald-800"
      >
        <CheckCircle2 size={28} strokeWidth={1.75} />
        <p className="font-medium">ثبت‌نام با موفقیت انجام شد.</p>
        <p className="text-sm">
          اگر تأیید ایمیل فعال باشد، لینک فعال‌سازی برایتان ارسال شده است. در غیر این صورت می‌توانید{" "}
          <Link href="/auth/login" className="underline underline-offset-2">
            وارد شوید
          </Link>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form dir="rtl" action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          ایمیل
        </label>
        <div className="relative">
          <Mail size={17} strokeWidth={1.75} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            className="w-full rounded-xl border border-zinc-300 py-2.5 pl-4 pr-10 text-left transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          رمز عبور
        </label>
        <div className="relative">
          <Lock size={17} strokeWidth={1.75} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            dir="ltr"
            className="w-full rounded-xl border border-zinc-300 py-2.5 pl-4 pr-10 text-left transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-xl bg-violet-600 px-4 py-2.5 font-medium text-white shadow-sm shadow-violet-200 transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "در حال پردازش..." : mode === "login" ? "ورود" : "ثبت‌نام"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        {mode === "login" ? (
          <>
            حساب کاربری ندارید؟{" "}
            <Link href="/auth/signup" className="font-medium text-violet-600 hover:underline">
              ثبت‌نام کنید
            </Link>
          </>
        ) : (
          <>
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/auth/login" className="font-medium text-violet-600 hover:underline">
              وارد شوید
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
