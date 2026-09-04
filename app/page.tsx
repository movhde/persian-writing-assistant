import { WritingEditor } from "@/app/components/editor/WritingEditor";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div dir="rtl" className="w-full max-w-4xl px-4 pt-10 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          نوشتار بهتر، با کمک هوش مصنوعی
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-zinc-500">
          متن فارسی خود را وارد کنید، عملیات مورد نظر را انتخاب کنید و نتیجه را در کنار متن اصلی با
          تفاوت‌های برجسته‌شده ببینید.
        </p>
      </div>
      <WritingEditor />
    </div>
  );
}
