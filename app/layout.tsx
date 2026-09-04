import type { Metadata } from "next";
import "@fontsource-variable/vazirmatn/wght.css";
import "./globals.css";
import { Header } from "@/app/components/layout/Header";

export const metadata: Metadata = {
  title: "دستیار هوشمند نوشتار فارسی",
  description: "بهبود، خلاصه‌سازی، تغییر لحن و ساده‌سازی متون فارسی با هوش مصنوعی",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50">
        <Header />
        {children}
      </body>
    </html>
  );
}
