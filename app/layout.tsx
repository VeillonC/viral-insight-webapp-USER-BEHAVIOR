import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "./LangContext";
import Nav from "./Nav";
import Footer from "./Footer";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EV campaign analyser",
  description: "AI-powered analytics for electric vehicle advertising campaigns: predict and explain the virality of a social-media post.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <LangProvider>
          <Nav />
          <main className="container">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
