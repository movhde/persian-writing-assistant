import { AuthForm } from "@/app/components/auth/AuthForm";
import { AuthCard } from "@/app/components/auth/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard title="ورود به حساب کاربری">
      <AuthForm mode="login" />
    </AuthCard>
  );
}
