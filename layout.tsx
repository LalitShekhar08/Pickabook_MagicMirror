import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";  // <--- IMPORTANT: This connects the styles

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pickabook Magic Mirror",
  description: "AI Illustration Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}