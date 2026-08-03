"use client";

import { useEffect, useRef, useState } from "react";
import { predict, getReport } from "@/lib/api";
import { Prediction, Source, Lang } from "@/lib/types";
import { useLang } from "../LangContext";
import { InfoTip, NET_NAMES, NetworkCompare, ScoreGauge, MetaGrid, SummaryBox, FactorBars, Suggestions, ReportPanel } from "../components";

interface NetResult { source: Source; audience: number | null; prediction: Prediction; }
const NETWORKS: Source[] = ["youtube", "x", "reddit"];

const EXAMPLES: { label: string; text: string }[] = [
  { label: "Range claim", text: "Our new electric SUV delivers 510 km of range on a single charge — book your test drive today!" },
  { label: "Charging network", text: "Worried about charging? Over 3,000 fast-charging stations are now available nationwide." },
  { label: "Price + incentive", text: "Going electric has never been cheaper — government incentives cut up to $7,500 off this month." },
];

export default function Analyze() {
  const { lang } = useLang();
  const [text, setText] = useState("");
  const [audYt, setAudYt] = useState("");
  const [audX, setAudX] = useState("");
  const [audRd, setAudRd] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const [analyzedText, setAnalyzedText] = useState<string | null>(null);
  const [results, setResults] = useState<NetResult[]>([]);
  const [selected, setSelected] = useState<Source>("youtube");
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const firstLang = useRef(true);

  useEffect(() => {
    const el = taRef.current;
    if (el) { el.style.height = "auto"; el.style.height = `${Math.max(el.scrollHeight, 280)}px`; }
  }, [text]);

  const parseAud = (raw: string) => (raw.trim() ? Number(raw.replace(/[^0-9.]/g, "")) : null);
  const audMap = (): Record<Source, number | null> => ({ youtube: parseAud(audYt), x: parseAud(audX), reddit: parseAud(audRd), "": null });

  async function fetchReport(txt: string, s: Source, audience: number | null, l: Lang) {
    setLoadingReport(true);
    setReportError(null);
    try {
      const res = await getReport(txt, s, audience, l);
      setReport(res.report);
    } catch (e) {
      setReport(null);
      setReportError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setLoadingReport(false);
    }
  }

  useEffect(() => {
    if (firstLang.current) { firstLang.current = false; return; }
    const sel = results.find((r) => r.source === selected);
    if (sel && analyzedText) fetchReport(analyzedText, selected, sel.audience, lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function onAnalyze() {
    const auds = audMap();
    setAnalyzedText(text);
    setResults([]);
    setReport(null);
    setError(null);
    setReportError(null);
    setLoading(true);
    try {
      const preds = await Promise.all(NETWORKS.map((s) => predict(text, s, auds[s])));
      const res: NetResult[] = NETWORKS.map((s, i) => ({ source: s, audience: auds[s], prediction: preds[i] }));
      setResults(res);
      const best = res.reduce((a, b) => (b.prediction.viral_score > a.prediction.viral_score ? b : a));
      setSelected(best.source);
      setLoading(false);
      fetchReport(text, best.source, best.audience, lang);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  function selectNetwork(s: Source) {
    setSelected(s);
    const r = results.find((x) => x.source === s);
    if (r && analyzedText) fetchReport(analyzedText, s, r.audience, lang);
  }

  const sel = results.find((r) => r.source === selected);

  return (
    <>
      <h1 className="page-title">Get your EV campaign review</h1>
      <p className="input-cue">Paste your post and your audience per network — we compare YouTube, X and Reddit, explain the score and write an actionable report. <strong>Fill in the fields below to start.</strong></p>

      <div className="card">
        <div className="input-grid">
          <div>
            <label htmlFor="post">Post</label>
            <textarea ref={taRef} id="post" value={text} onChange={(e) => setText(e.target.value)}
              placeholder="e.g. New electric SUV, 510 km range on a single charge — book your test drive today!" />
            <div className="examples">
              Try an example:
              {EXAMPLES.map((ex) => (
                <button key={ex.label} className="example-chip" onClick={() => setText(ex.text)}>{ex.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="aud-label">Your audience per network <InfoTip term="audience" /> <span className="muted">(optional)</span></div>
            <div className="aud-stack">
              <div><label>YouTube subscribers</label><input value={audYt} onChange={(e) => setAudYt(e.target.value)} placeholder="e.g. 50000" inputMode="numeric" /></div>
              <div><label>X followers</label><input value={audX} onChange={(e) => setAudX(e.target.value)} placeholder="e.g. 12000" inputMode="numeric" /></div>
              <div><label>Reddit members</label><input value={audRd} onChange={(e) => setAudRd(e.target.value)} placeholder="e.g. 340000" inputMode="numeric" /></div>
            </div>
            <button className="btn btn-block" onClick={onAnalyze} disabled={loading || !text.trim()}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error" style={{ marginTop: "1.25rem" }}>{error}</div>}

      {analyzedText && !error && (
        <div className="preview" style={{ marginTop: "1.25rem" }}>
          <div className="lbl">Analyzing</div>
          <div className="txt">{analyzedText}</div>
          <div className="tags">comparing YouTube, X and Reddit · report in {lang.toUpperCase()}</div>
        </div>
      )}

      {results.length > 0 && (
        <>
          <NetworkCompare results={results} selected={selected} onSelect={selectNetwork} />
          {sel && (
            <>
              <div className="eyebrow">Details — {NET_NAMES[selected]}</div>
              <div className="metrics">
                <ScoreGauge prediction={sel.prediction} />
                <MetaGrid prediction={sel.prediction} source={selected} />
              </div>
              <SummaryBox factors={sel.prediction.top_factors} />
              <div className="stack">
                <FactorBars factors={sel.prediction.top_factors} />
                <ReportPanel report={report} loading={loadingReport} error={reportError} />
                <Suggestions items={sel.prediction.suggestions} />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
