import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Day 1 — Gemini Notebook Mastery K8",
  description: "Tạo Notebook đầu tiên và Quick Win có thể dùng ngay.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
