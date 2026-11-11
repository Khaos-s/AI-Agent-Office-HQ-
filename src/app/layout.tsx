import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasyUp HQ Command",
  description: "AI Agent Operations Center — 2D Campus, Shared Brain, HITL Gate",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#07090f] text-slate-100 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
