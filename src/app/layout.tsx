import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sparrow — الرد التلقائي على فيسبوك",
  description: "منصة ذكية للرد التلقائي على تعليقات صفحات فيسبوك",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang="ar" و dir="rtl" لدعم العربية بشكل صحيح
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
