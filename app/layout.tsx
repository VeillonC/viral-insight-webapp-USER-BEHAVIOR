import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "./LangContext";
import Nav from "./Nav";
import Footer from "./Footer";
import { Analytics } from "@vercel/analytics/react";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = "https://ev-campaignanalyser.vercel.app";
const TITLE = "EV Campaign Analyser";
const DESCRIPTION = "Explainable AI analytics for electric-vehicle advertising: predict and explain how a social-media post will perform on YouTube, X and Reddit — before you post.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${TITLE}` },
  description: DESCRIPTION,
  applicationName: TITLE,
  keywords: ["EV advertising", "electric vehicle marketing", "virality prediction", "explainable AI", "green marketing", "sustainable marketing"],
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <LangProvider>
          <Nav />
          <main className="container">{children}</main>
          <Footer />
          <Analytics />
        </LangProvider>
      </body>
    </html>
  );
}
