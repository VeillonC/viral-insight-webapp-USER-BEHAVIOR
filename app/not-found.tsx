"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useT();
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <div style={{ fontFamily: "var(--font-head)", fontSize: 72, fontWeight: 700, color: "var(--accent-dark)", letterSpacing: "-0.03em" }}>404</div>
      <h1 className="page-title" style={{ marginTop: 8 }}>{t("nf.title")}</h1>
      <p className="page-subtitle" style={{ maxWidth: 460, margin: "0 auto 1.75rem" }}>{t("nf.sub")}</p>
      <Link href="/" className="cta-btn" style={{ background: "var(--accent)", color: "#fff" }}>{t("nf.home")}</Link>
    </div>
  );
}
