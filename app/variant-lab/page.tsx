"use client";

import { useState } from "react";
import { predictBatch } from "@/lib/api";
import { Prediction, Source } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface VarResult { text: string; prediction: Prediction; }

export default function VariantLab() {
  const { t } = useT();
  const [source, setSource] = useState<Source>("youtube");
  const [audience, setAudience] = useState("");
  const [variants, setVariants] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<VarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setVariant = (i: number, v: string) => setVariants((a) => a.map((x, j) => (j === i ? v : x)));
  const addVariant = () => setVariants((a) => (a.length < 5 ? [...a, ""] : a));
  const removeVariant = (i: number) => setVariants((a) => (a.length > 2 ? a.filter((_, j) => j !== i) : a));

  async function onCompare() {
    const aud = audience.trim() ? Number(audience.replace(/[^0-9.]/g, "")) : null;
    const items = variants.map((t) => t.trim()).filter(Boolean).map((t) => ({ text: t, source, audience: aud }));
    if (items.length < 2) { setError(t("vl.need2")); return; }
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const preds = await predictBatch(items);
      setResults(items.map((it, i) => ({ text: it.text, prediction: preds[i] })));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("vl.err"));
    } finally {
      setLoading(false);
    }
  }

  const ranked = [...results].sort((a, b) => b.prediction.viral_score - a.prediction.viral_score);
  const bestText = ranked[0]?.text;

  return (
    <>
      <h1 className="page-title">{t("vl.title")}</h1>
      <p className="input-cue">{t("vl.cue")}</p>

      <div className="card">
        <div className="fields">
          <div style={{ maxWidth: 220 }}>
            <label htmlFor="vsource">{t("vl.platform")}</label>
            <select id="vsource" value={source} onChange={(e) => setSource(e.target.value as Source)}>
              <option value="youtube">YouTube</option>
              <option value="x">X</option>
              <option value="reddit">Reddit</option>
            </select>
          </div>
          <div style={{ maxWidth: 220 }}>
            <label htmlFor="vaud">{t("vl.aud")}</label>
            <input id="vaud" value={audience} onChange={(e) => setAudience(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 50000" inputMode="numeric" pattern="[0-9]*" />
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          {variants.map((v, i) => (
            <div key={i}>
              <label>
                {t("vl.variant", i + 1)}
                {variants.length > 2 && <button className="link-x" onClick={() => removeVariant(i)}>{t("vl.remove")}</button>}
              </label>
              <textarea value={v} onChange={(e) => setVariant(i, e.target.value)} placeholder={t("vl.variant.ph")} style={{ minHeight: 90 }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 12, flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={addVariant} disabled={variants.length >= 5}>{t("vl.add")}</button>
          <button className="btn" onClick={onCompare} disabled={loading}>{loading ? t("vl.comparing") : t("vl.compare")}</button>
        </div>
      </div>

      {error && <div className="error" style={{ marginTop: "1.25rem" }}>{error}</div>}

      {results.length > 0 && (
        <>
          <div className="eyebrow">{t("vl.ranking")}</div>
          <div className="stack">
            {ranked.map((r, idx) => {
              const pct = Math.round(r.prediction.viral_score * 100);
              const isViral = r.prediction.viral_score >= 0.5;
              return (
                <div className={`card variant-result${r.text === bestText ? " best" : ""}`} key={idx}>
                  <div className="variant-top">
                    <span className="variant-rank">#{idx + 1}</span>
                    <span className="ex-score" style={{ color: isViral ? "var(--accent-dark)" : "var(--down)" }}>{pct}%</span>
                    <span className="badge">{r.prediction.label === "viral-likely" ? t("lbl.viral") : r.prediction.label === "not-viral" ? t("lbl.notviral") : r.prediction.label}</span>
                    {r.text === bestText && <span className="net-best" style={{ position: "static" }}>{t("cmp.best")}</span>}
                  </div>
                  <div className="variant-text">{r.text}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
