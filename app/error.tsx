"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useT();
  useEffect(() => {
    // Surface the error for debugging instead of hiding it silently.
    console.error(error);
  }, [error]);
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <div style={{ fontFamily: "var(--font-head)", fontSize: 56, fontWeight: 700, color: "var(--down)", letterSpacing: "-0.03em" }}>!</div>
      <h1 className="page-title" style={{ marginTop: 8 }}>{t("err.title")}</h1>
      <p className="page-subtitle" style={{ maxWidth: 460, margin: "0 auto 1.75rem" }}>{t("err.sub")}</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn" onClick={() => reset()}>{t("err.retry")}</button>
        <Link href="/" className="btn-ghost">{t("err.home")}</Link>
      </div>
    </div>
  );
}
