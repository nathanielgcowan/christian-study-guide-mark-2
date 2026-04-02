import type { Metadata } from "next";
import { Quando } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import AutoSyncClient from "@/components/AutoSyncClient";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SkipToMain from "@/components/SkipToMain";
import { GoogleAnalytics } from "@next/third-parties/google";

const quandoSans = Quando({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

const quandoSerif = Quando({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  title: {
    default: "Christian Study Guide",
    template: "%s | Christian Study Guide",
  },
  description:
    "A rebuilt Christian study website for Scripture reading, prayer, devotionals, memorization, and deeper Bible exploration.",
  authors: [{ name: "Nathaniel Cowan" }],
  applicationName: "Christian Study Guide",
  keywords: [
    "Christian study guide",
    "Bible study",
    "reading plans",
    "prayer journal",
    "devotionals",
  ],
};

export const admin = {
  name: "Nathaniel Cowan",
  email: "nathaniel.g.cowan@gmail.com",
};

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quandoSans.variable} ${quandoSerif.variable} app-body antialiased`}
      >
        <Providers>
          <AutoSyncClient />
          <SkipToMain />
          <div className="site-frame">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
        <Analytics />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_ID || ""}
        />
      </body>
    </html>
  );
}
