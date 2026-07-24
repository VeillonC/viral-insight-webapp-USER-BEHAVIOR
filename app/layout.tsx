import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral insight",
  description: "Predict and explain the virality of a social-media post about EV ad campaigns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
