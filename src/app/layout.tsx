import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "EduQuiz Pro - Premium Learning & Practice App",
  description:
    "Practice MCQs, daily tests, mock exams, previous papers and stay updated with latest exam notifications.",
  keywords: [
    "EduQuiz Pro",
    "MCQ Practice",
    "Daily Tests",
    "Mock Exams",
    "Previous Papers",
    "Education",
    "Learning",
  ],
  authors: [{ name: "EduQuiz Pro Team" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
