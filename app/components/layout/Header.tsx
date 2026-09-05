import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header dir="rtl" className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-sm font-bold text-white">
            ن
          </span>
          <span className="truncate text-sm font-semibold text-zinc-900 sm:text-base">
            دستیار هوشمند نوشتار فارسی
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm sm:flex sm:gap-2">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            ویرایشگر
          </Link>
          {user && (
            <>
              <Link
                href="/history"
                className="rounded-full px-3 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                تاریخچه
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                داشبورد
              </Link>
            </>
          )}

          <span className="mx-1 h-5 w-px bg-zinc-200" />

          {user ? (
            <div className="flex items-center gap-2">
              <span dir="ltr" className="hidden text-xs text-zinc-400 lg:inline">
                {user.email}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-full px-3 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                ورود
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-zinc-900 px-4 py-1.5 font-medium text-white transition-colors hover:bg-zinc-700"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </nav>

        <MobileNav userEmail={user?.email ?? null} />
      </div>
    </header>
  );
}
