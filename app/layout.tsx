import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SkipToMain from "@/components/SkipToMain";
import { GoogleAnalytics } from "@next/third-parties/google";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
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
        className={`${sans.variable} ${serif.variable} app-body antialiased`}
      >
        <Providers>
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
