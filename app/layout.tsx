import type { Metadata } from "next";
import Link from "next/link";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "./LangContext";
import Nav from "./Nav";

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
          <footer className="footer">
            <div className="footer-inner">
              <span>EV campaign analyser — AI &amp; Big Data for sustainable marketing</span>
              <span>
                <Link href="/insights">Insights</Link>
                <a href="https://github.com/VeillonC/viral-insight-webapp-USER-BEHAVIOR" target="_blank" rel="noreferrer">GitHub</a>
              </span>
            </div>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
