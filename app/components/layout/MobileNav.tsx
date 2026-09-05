"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const linkClass =
  "rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100";

export function MobileNav({ userEmail }: { userEmail: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="منو"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-zinc-200 bg-white shadow-sm"
          >
            <nav dir="rtl" className="flex flex-col gap-1 px-4 py-3">
              <Link href="/" onClick={() => setOpen(false)} className={linkClass}>
                ویرایشگر
              </Link>
              {userEmail && (
                <>
                  <Link href="/history" onClick={() => setOpen(false)} className={linkClass}>
                    تاریخچه
                  </Link>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                    داشبورد
                  </Link>
                </>
              )}

              <div className="my-1 h-px bg-zinc-100" />

              {userEmail ? (
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span dir="ltr" className="text-xs text-zinc-400">
                    {userEmail}
                  </span>
                  <SignOutButton />
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-1 py-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-center text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-zinc-900 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-700"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
