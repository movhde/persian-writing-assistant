import { AuthForm } from "@/app/components/auth/AuthForm";
import { AuthCard } from "@/app/components/auth/AuthCard";

export default function SignupPage() {
  return (
    <AuthCard title="ساخت حساب کاربری">
      <AuthForm mode="signup" />
    </AuthCard>
  );
}
