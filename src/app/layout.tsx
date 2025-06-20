import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navigation from "@/components/layout/navigation";
import { SupabaseListener } from "@/components/supabase-listener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Template",
  description: "A simple Next.js template project with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseListener>
          <header className="border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between p-4">
              <Link href="/" className="text-xl font-bold">
                Template
              </Link>
              <Navigation />
            </div>
          </header>
          <main className="container mx-auto p-4">{children}</main>
        </SupabaseListener>
      </body>
    </html>
  );
}
