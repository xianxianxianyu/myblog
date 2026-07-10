import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Josh — Design engineer",
  description: "A calm, considered portfolio experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
