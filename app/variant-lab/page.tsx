"use client";

import { useState } from "react";
import { predictBatch } from "@/lib/api";
import { Prediction, Source } from "@/lib/types";

interface VarResult { text: string; prediction: Prediction; }

export default function VariantLab() {
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
    if (items.length < 2) { setError("Add at least two non-empty variants to compare."); return; }
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const preds = await predictBatch(items);
      setResults(items.map((it, i) => ({ text: it.text, prediction: preds[i] })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const ranked = [...results].sort((a, b) => b.prediction.viral_score - a.prediction.viral_score);
  const bestText = ranked[0]?.text;

  return (
    <>
      <h1 className="page-title">Variant lab</h1>
      <p className="input-cue">Write several versions of a post and compare their viral score on the same platform — pick the strongest before publishing.</p>

      <div className="card">
        <div className="fields">
          <div style={{ maxWidth: 220 }}>
            <label htmlFor="vsource">Platform</label>
            <select id="vsource" value={source} onChange={(e) => setSource(e.target.value as Source)}>
              <option value="youtube">YouTube</option>
              <option value="x">X</option>
              <option value="reddit">Reddit</option>
            </select>
          </div>
          <div style={{ maxWidth: 220 }}>
            <label htmlFor="vaud">Audience (optional)</label>
            <input id="vaud" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. 50000" inputMode="numeric" />
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          {variants.map((v, i) => (
            <div key={i}>
              <label>
                Variant {i + 1}
                {variants.length > 2 && <button className="link-x" onClick={() => removeVariant(i)}>remove</button>}
              </label>
              <textarea value={v} onChange={(e) => setVariant(i, e.target.value)} placeholder="Write a version of your post…" style={{ minHeight: 90 }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 12, flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={addVariant} disabled={variants.length >= 5}>+ Add variant</button>
          <button className="btn" onClick={onCompare} disabled={loading}>{loading ? "Comparing…" : "Compare variants"}</button>
        </div>
      </div>

      {error && <div className="error" style={{ marginTop: "1.25rem" }}>{error}</div>}

      {results.length > 0 && (
        <>
          <div className="eyebrow">Ranking</div>
          <div className="stack">
            {ranked.map((r, idx) => {
              const pct = Math.round(r.prediction.viral_score * 100);
              const isViral = r.prediction.viral_score >= 0.5;
              return (
                <div className={`card variant-result${r.text === bestText ? " best" : ""}`} key={idx}>
                  <div className="variant-top">
                    <span className="variant-rank">#{idx + 1}</span>
                    <span className="ex-score" style={{ color: isViral ? "var(--accent-dark)" : "var(--down)" }}>{pct}%</span>
                    <span className="badge">{r.prediction.label}</span>
                    {r.text === bestText && <span className="net-best" style={{ position: "static" }}>Best</span>}
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
