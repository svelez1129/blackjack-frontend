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
  title: "BLACKJACK - Premium Casino Experience | Play Free with $1,000",
  description: "Experience the thrill of high-stakes blackjack with our premium casino game. Start with $1,000, no registration required. Authentic rules, luxury interface, instant play.",
  keywords: "premium blackjack, luxury casino, high stakes blackjack, VIP blackjack, free casino game, authentic blackjack",
  openGraph: {
    title: "BLACKJACK - Premium Casino Experience",
    description: "Step into the world of high-stakes blackjack. $1,000 starting bankroll, luxury interface, authentic casino rules.",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
