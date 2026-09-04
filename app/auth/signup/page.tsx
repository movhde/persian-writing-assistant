import { AuthForm } from "@/app/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 dir="rtl" className="mb-6 text-center text-xl font-semibold text-zinc-900">
          ساخت حساب کاربری
        </h1>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
