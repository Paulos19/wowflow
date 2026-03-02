import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "wowflow — Automações & Dashboards Criativos",
  description:
    "A wowflow é uma agência de automações e dashboards criativos, pronta para revolucionar o mundo. Transformamos dados em experiências visuais impactantes.",
  keywords: ["automação", "dashboards", "dados", "wowflow", "criativo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
