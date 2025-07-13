import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { PerformanceMonitor } from "@/components/ui/PerformanceMonitor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: false, // Only preload the main font
});

export const metadata: Metadata = {
  title: "Free Blackjack Game - Premium Casino Experience | $1,000 Starting Bankroll",
  description: "Play the ultimate luxury blackjack game online! Start with $1,000, authentic casino rules, premium sound effects, achievements system. No registration required - instant play!",
  keywords: "free blackjack game, online casino blackjack, luxury blackjack, premium casino game, blackjack 21, casino table games, authentic blackjack rules, high stakes blackjack, VIP blackjack experience",
  authors: [{ name: "Premium Casino Games" }],
  creator: "Premium Casino Games",
  publisher: "Premium Casino Games",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Free Blackjack Game - Premium Casino Experience",
    description: "Experience luxury blackjack with $1,000 starting bankroll. Authentic casino rules, premium sound effects, and achievement system. Play instantly!",
    type: "website",
    siteName: "Premium Blackjack Casino",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Premium Blackjack Casino Game"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Blackjack Game - Premium Casino Experience",
    description: "Experience luxury blackjack with $1,000 starting bankroll. Play instantly!",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://blackjackus.com",
  },
  other: {
    "google-site-verification": "your-verification-code-here"
  }
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3418354843092692"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
        {/* Vercel Analytics */}
        <Analytics />
        {/* Performance Monitoring */}
        <PerformanceMonitor />
      </body>
    </html>
  );
}
