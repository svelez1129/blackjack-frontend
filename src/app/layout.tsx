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
  title: "Free Blackjack Online - Play Instantly, No Signup Required",
  description: "Play free blackjack online with $1,000 virtual money. No registration needed, instant play, authentic casino rules. Best free blackjack game online!",
  keywords: "free blackjack, online blackjack, blackjack game, play blackjack free, no signup blackjack, casino game",
  openGraph: {
    title: "Free Blackjack Online - Play Now!",
    description: "Play free blackjack instantly with $1,000 virtual money. No signup required!",
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
