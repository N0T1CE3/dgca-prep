import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DGCA Prep - Aviation Question Bank",
  description: "Master your ATPL/DGCA exams with comprehensive question banks, gamified learning, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 -z-10" />
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 -z-10" />
        {children}
      </body>
    </html>
  );
}
