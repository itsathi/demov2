import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Concept Website Demos — Athinem Creatives",
    template: "%s · Athinem Creatives",
  },
  description:
    "Re-imagined digital presences for manufacturing and engineering brands — real company data, engineered visuals and a working enquiry flow.",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-ink">{children}</body>
    </html>
  );
}