import Link from "next/link";

export default function NotFound() {
  return (
    <div dir="rtl" className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <p className="text-sm font-medium text-violet-600">۴۰۴</p>
      <h1 className="text-xl font-bold text-zinc-900">این صفحه پیدا نشد</h1>
      <p className="max-w-sm text-sm text-zinc-500">
        صفحه‌ای که دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
      </p>
      <Link
        href="/"
        className="mt-3 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
