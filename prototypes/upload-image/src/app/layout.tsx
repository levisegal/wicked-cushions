import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audeze Maxwell Earpads - WC FreeZe Cooling Gel",
  description: "WC FreeZe Hybrid Maxwell - Cooling Gel Replacement Ear Cushions for Audeze Maxwell Headphones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anton.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
