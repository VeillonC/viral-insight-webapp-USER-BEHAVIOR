"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "./LangContext";
import { useT } from "@/lib/i18n";
import { Icon } from "./components";

const LINKS = [
  { href: "/analyze", key: "nav.analyze" },
  { href: "/variant-lab", key: "nav.variant" },
  { href: "/history", key: "nav.history" },
  { href: "/insights", key: "nav.insights" },
];

export default function Nav() {
  const path = usePathname();
  const { lang, setLang } = useLang();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="logo" aria-hidden="true">
            <Image src="/logo.svg" alt="" width={60} height={60} priority />
          </span>
          <span className="brand-name">EV campaign analyser</span>
        </Link>
        <button
          className="nav-burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "list"} size={22} />
        </button>
        <div className={`nav-links${open ? " open" : ""}`}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""} onClick={() => setOpen(false)}>
              {t(l.key)}
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
