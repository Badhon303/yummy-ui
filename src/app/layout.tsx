import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { AuthProvider } from "@/context/AuthContext";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yummy Bakery — Happiness in Every Bite",
  description:
    "Freshly baked breads, buns, cakes and savoury treats from Yummy Bakery. Order online for delivery or pickup from any of our outlets.",
  icons: {
    icon: "/logo/favicon.ico",
    shortcut: "/logo/favicon.ico",
    apple: "/logo/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-cream-50 font-body antialiased">
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
