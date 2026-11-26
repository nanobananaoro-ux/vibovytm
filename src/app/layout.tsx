import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "VIBOVYTM — Футбольная аналитика ФТКЛ и ИРФФ",
  description: "Профессиональная футбольная аналитическая платформа. Игроки, клубы, лиги, рыночные стоимости, трансферы и статистика.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vibovytm.vercel.app"),
  openGraph: {
    title: "VIBOVYTM — Футбольная аналитика ФТКЛ и ИРФФ",
    description: "Профессиональная футбольная аналитическая платформа для сообществ ФТКЛ и ИРФФ",
    type: "website",
    locale: "ru_RU",
    siteName: "VIBOVYTM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}