import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingSupportButton } from "@/components/FloatingSupportButton"; // ИСПРАВЛЕННЫЙ ПУТЬ

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Договорка — AI-аудит договоров",
  description: "Проверьте договор на скрытые риски за 30 секунд с помощью искусственного интеллекта.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {children}
        
        {/* Плавающая кнопка поддержки */}
        <FloatingSupportButton />
        
      </body>
    </html>
  );
}