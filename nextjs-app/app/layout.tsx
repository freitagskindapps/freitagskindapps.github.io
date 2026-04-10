import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "freitagskind — thoughtful apps",
  description: "Small, focused apps for people who want tools that work quietly and well.",
  openGraph: {
    type: "website",
    title: "freitagskind — thoughtful apps",
    description: "Small, focused apps for people who want tools that work quietly and well.",
    url: "https://freitagskindapps.github.io/",
  },
  twitter: {
    card: "summary",
    title: "freitagskind — thoughtful apps",
    description: "Small, focused apps for people who want tools that work quietly and well.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col">{children}</body>
    </html>
  );
}
