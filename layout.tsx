import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metik — Media Teknologi",
  description: "Sosial media untuk komunitas teknologi Indonesia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
