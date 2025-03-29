import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ML Platform - No-Code Machine Learning",
  description:
    "Train, evaluate, and deploy machine learning models without writing a single line of code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={`antialiased ${inter.className}`}>{children}</body>
    </html>
  );
}
