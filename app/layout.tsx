import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemini Notebook Mastery K8 — 13 ngày thực hành",
  description: "Trung tâm học tập 13 ngày: Notebook, nguồn, trích dẫn và sản phẩm thực hành.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
