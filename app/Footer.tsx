"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>{t("footer.tagline")}</span>
        <span>
          <Link href="/insights">{t("footer.insights")}</Link>
          <a href="https://github.com/VeillonC/viral-insight-webapp-USER-BEHAVIOR" target="_blank" rel="noreferrer">{t("footer.github")}</a>
        </span>
      </div>
    </footer>
  );
}
