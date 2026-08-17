import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Welcome",
  description: "A simple homepage.",
};

export default function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
