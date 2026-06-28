import type { Metadata } from "next";
import "./globals.css";
import { kalameh } from "@/lib/fonts";
import { LayoutShell } from "@/components/layout-shell";

export const metadata: Metadata = {
  title: "تکباکس | رسانه تکنولوژی و زیرساخت",
  description: "پاتوق بچه‌های فناوری اطلاعات، بررسی تخصصی سرور، شبکه و هوش مصنوعی",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={kalameh.variable}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased text-foreground selection:bg-brand/20 selection:text-brand">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
