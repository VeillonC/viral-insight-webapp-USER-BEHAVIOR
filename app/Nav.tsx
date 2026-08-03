"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./LangContext";

const LINKS = [
  { href: "/analyze", label: "Analyze" },
  { href: "/variant-lab", label: "Variant lab" },
  { href: "/insights", label: "Insights" },
  { href: "/history", label: "History" },
  { href: "/glossary", label: "Glossary" },
];

export default function Nav() {
  const path = usePathname();
  const { lang, setLang } = useLang();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="logo" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0c3b24" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2 L4 14 h7 l-1 8 9-12 h-7 z" />
            </svg>
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
