"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      <div dir="rtl" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
        <p className="font-medium">ثبت‌نام با موفقیت انجام شد.</p>
        <p className="mt-1 text-sm">
          اگر تأیید ایمیل فعال باشد، لینک فعال‌سازی برایتان ارسال شده است. در غیر این صورت می‌توانید{" "}
          <Link href="/auth/login" className="underline underline-offset-2">
            وارد شوید
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form dir="rtl" action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          ایمیل
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          dir="ltr"
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-left focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          dir="ltr"
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-left focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-xl bg-violet-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
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
