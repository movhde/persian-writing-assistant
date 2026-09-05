import { WritingEditor } from "@/app/components/editor/WritingEditor";
import { Hero } from "@/app/components/landing/Hero";
import { FeatureGrid } from "@/app/components/landing/FeatureGrid";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <Hero />
      <FeatureGrid />
      <div id="editor" className="w-full scroll-mt-16 border-t border-zinc-200 bg-zinc-50">
        <div dir="rtl" className="mx-auto w-full max-w-4xl px-4 pt-10 text-center sm:px-6">
          <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">امتحان کنید</h2>
          <p className="mx-auto mt-2 max-w-xl text-zinc-500">
            متن فارسی خود را وارد کنید، عملیات مورد نظر را انتخاب کنید و نتیجه را ببینید.
          </p>
        </div>
        <WritingEditor />
      </div>
    </div>
  );
}
