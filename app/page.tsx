"use client";

import { useState } from "react";
import { analyze } from "@/lib/api";
import { Lang, ReportResponse, Source } from "@/lib/types";
import { ScoreCard, FactorBars, ResultPanels } from "./components";

export default function Home() {
  const [text, setText] = useState("");
  const [source, setSource] = useState<Source>("youtube");
  const [audience, setAudience] = useState("");
  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportResponse | null>(null);

  async function onAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const aud = audience.trim() ? Number(audience.replace(/[^0-9.]/g, "")) : null;
      const res = await analyze(text, source, aud, lang);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="header">
        <div className="brand">
          <span aria-hidden="true">&#128293;</span>
          <span>Viral insight</span>
        </div>
        <div className="lang-toggle">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "vi" ? "active" : ""} onClick={() => setLang("vi")}>VI</button>
        </div>
      </div>

      <div className="card">
        <label htmlFor="post">Post</label>
        <textarea
          id="post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New electric SUV, 500km range, book your test drive today!"
        />
        <div className="row">
          <div>
            <label htmlFor="source">Platform</label>
            <select id="source" value={source} onChange={(e) => setSource(e.target.value as Source)}>
              <option value="youtube">YouTube</option>
              <option value="x">X</option>
              <option value="reddit">Reddit</option>
            </select>
          </div>
          <div>
            <label htmlFor="audience">Audience (optional)</label>
            <input
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="800000"
            />
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <button className="btn" onClick={onAnalyze} disabled={loading || !text.trim()}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <>
          <ScoreCard prediction={result.prediction} />
          <FactorBars factors={result.prediction.top_factors} />
          <ResultPanels prediction={result.prediction} report={result.report} />
        </>
      )}

      {!result && !error && (
        <p className="hint">Enter a post, pick a platform, and click Analyze to get a viral score, the factors behind it, and a generated report.</p>
      )}
    </main>
  );
}
