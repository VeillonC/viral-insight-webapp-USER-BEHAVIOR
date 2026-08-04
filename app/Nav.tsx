"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLang } from "./LangContext";

const LINKS = [
  { href: "/analyze", label: "Analyze" },
  { href: "/variant-lab", label: "Variant lab" },
  { href: "/history", label: "History" },
  { href: "/insights", label: "Insights" },
];

export default function Nav() {
  const path = usePathname();
  const { lang, setLang } = useLang();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="logo" aria-hidden="true">
            <Image src="/logo.svg" alt="" width={60} height={60} priority />
          </span>
          <span className="brand-name">EV campaign analyser</span>
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="lang-toggle">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "vi" ? "active" : ""} onClick={() => setLang("vi")}>VI</button>
        </div>
      </div>
    </nav>
  );
}
