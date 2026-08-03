"use client";

import ReactMarkdown from "react-markdown";
import { Factor, Prediction, Source } from "@/lib/types";
import { PLATFORM_RELIABILITY, GLOSSARY } from "@/lib/config";

const PATHS: Record<string, string> = {
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-4",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  chart: "M3 3v18h18 M7 16v-5 M12 16V8 M17 16v-9",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6 M9 13h6 M9 17h6",
  bulb: "M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 0 0-4-12Z",
  check: "M20 6 9 17l-5-5",
  up: "M7 17 17 7 M8 7h9v9",
  down: "M7 7l10 10 M17 8v9H8",
};

export function Icon({ name, size = 18 }: { name: keyof typeof PATHS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name].split(" M").map((seg, i) => <path key={i} d={(i === 0 ? "" : "M") + seg} />)}
    </svg>
  );
}

export function InfoTip({ term }: { term: keyof typeof GLOSSARY }) {
  return (
    <span className="tip" tabIndex={0} aria-label={GLOSSARY[term]}>
      i<span className="tip-bubble">{GLOSSARY[term]}</span>
    </span>
  );
}

export const NET_NAMES: Record<string, string> = { youtube: "YouTube", x: "X", reddit: "Reddit" };

export function NetworkCompare({ results, selected, onSelect }: {
  results: { source: Source; prediction: Prediction }[];
  selected: Source;
  onSelect: (s: Source) => void;
}) {
  const best = results.reduce((a, b) => (b.prediction.viral_score > a.prediction.viral_score ? b : a), results[0]);
  const sorted = [...results].sort((a, b) => b.prediction.viral_score - a.prediction.viral_score);
  return (
    <div className="card" style={{ marginBottom: "1.25rem" }}>
      <div className="section-title"><Icon name="chart" /> How it performs per network</div>
      <div className="net-grid">
        {sorted.map((r) => {
          const pct = Math.round(r.prediction.viral_score * 100);
          const rel = Math.round((PLATFORM_RELIABILITY[r.source] ?? PLATFORM_RELIABILITY[""]) * 100);
          const isViral = r.prediction.viral_score >= 0.5;
          return (
            <button key={r.source} className={`net-card${r.source === selected ? " active" : ""}`} onClick={() => onSelect(r.source)}>
              {r.source === best.source && <span className="net-best">Best</span>}
              <div className="net-name">{NET_NAMES[r.source]}</div>
              <div className={`net-score${isViral ? "" : " low"}`}>{pct}%</div>
              <div className="net-sub">{r.prediction.label} · reliability {rel}%</div>
            </button>
          );
        })}
      </div>
      <div className="net-hint">Click a network to see its full breakdown below.</div>
    </div>
  );
}

function pretty(f: Factor) {
  return f.feature.startsWith("topic") ? "Content theme" : f.label;
}

export function ScoreGauge({ prediction }: { prediction: Prediction }) {
  const pct = Math.round(prediction.viral_score * 100);
  const isViral = prediction.viral_score >= 0.5;
  const C = 2 * Math.PI * 38;
  const offset = C * (1 - prediction.viral_score);
  const color = isViral ? "#15803d" : "#b45309";
  return (
    <div className={`gauge-card${isViral ? "" : " low"}`}>
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r="38" fill="none" stroke="#ffffff" strokeWidth="9" />
        <circle cx="46" cy="46" r="38" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} transform="rotate(-90 46 46)" />
        <text x="46" y="52" textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily="var(--font-head)">{pct}%</text>
      </svg>
      <div>
        <div className="gauge-label">Viral probability <InfoTip term="probability" /></div>
        <div className="badge">{prediction.label}</div>
      </div>
    </div>
  );
}

export function MetaGrid({ prediction, source }: { prediction: Prediction; source: Source }) {
  const conf = Math.round(prediction.confidence * 100);
  const rel = PLATFORM_RELIABILITY[source] ?? PLATFORM_RELIABILITY[""];
  const relPct = Math.round(rel * 100);
  const weak = rel < 0.75;
  return (
    <>
      <div className="metric">
        <div className="label"><span className="ico-badge teal"><Icon name="target" size={15} /></span>Confidence <InfoTip term="confidence" /></div>
        <div className="value">{conf}%</div>
        <div className="sub">distance from the 0.5 threshold</div>
      </div>
      <div className="metric">
        <div className="label"><span className={`ico-badge ${weak ? "amber" : "green"}`}><Icon name="shield" size={15} /></span>Platform reliability <InfoTip term="reliability" /></div>
        <div className="value">{relPct}%</div>
        <div className="sub">{source ? `ROC-AUC on ${source}` : "overall ROC-AUC"}{weak ? " · low, interpret with caution" : ""}</div>
      </div>
    </>
  );
}

export function SummaryBox({ factors }: { factors: Factor[] }) {
  const up = factors.filter((f) => f.direction === "up");
  const down = factors.filter((f) => f.direction === "down");
  return (
    <div className="card summary-card">
      <div className="section-title"><Icon name="list" /> Summary</div>
      <div className="summary-cols">
        <div>
          <div className="sum-head up"><Icon name="up" size={15} /> What&apos;s helping</div>
          {up.length ? up.map((f) => <div className="sum-item" key={f.feature}>{pretty(f)}</div>) : <div className="sum-item muted">—</div>}
        </div>
        <div>
          <div className="sum-head down"><Icon name="down" size={15} /> What&apos;s holding it back</div>
          {down.length ? down.map((f) => <div className="sum-item" key={f.feature}>{pretty(f)}</div>) : <div className="sum-item muted">—</div>}
        </div>
      </div>
    </div>
  );
}

export function FactorBars({ factors }: { factors: Factor[] }) {
  const max = Math.max(...factors.map((f) => Math.abs(f.contribution)), 0.0001);
  const sorted = [...factors].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  return (
    <div className="card">
      <div className="section-title"><Icon name="chart" /> Why <InfoTip term="factors" /></div>
      <div className="dbars">
        {sorted.map((f) => {
          const w = Math.max(4, (Math.abs(f.contribution) / max) * 50);
          return (
            <div className="drow" key={f.feature}>
              <span className="dname">{pretty(f)}</span>
              <div className="dtrack">
                <div className="daxis" />
                <div className={`dbar ${f.direction}`} style={f.direction === "up" ? { left: "50%", width: `${w}%` } : { right: "50%", width: `${w}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="dlegend">
        <span><span className="dot down" /> holds it back</span>
        <span>pushes viral <span className="dot up" /></span>
      </div>
    </div>
  );
}

export function Suggestions({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="card">
      <div className="section-title"><Icon name="bulb" /> Suggestions</div>
      <ul className="sugg-list">
        {items.map((s, i) => (
          <li key={i}><span className="sugg-ico"><Icon name="check" size={16} /></span><span>{s}</span></li>
        ))}
      </ul>
    </div>
  );
}

export function ReportPanel({ report, loading, error }: { report: string | null; loading: boolean; error: string | null }) {
  const body = report ? report.replace(/^\s*#{0,6}\s*report\s*\r?\n+/i, "").trim() : "";
  return (
    <div className="card">
      <div className="section-title"><Icon name="file" /> AI report</div>
      {loading && (
        <div className="skeleton">
          <span style={{ width: "90%" }} /><span style={{ width: "97%" }} /><span style={{ width: "80%" }} /><span style={{ width: "60%" }} />
          <div className="loading-row" style={{ marginTop: 6 }}><span className="spinner" />Writing the report…</div>
        </div>
      )}
      {error && !loading && <div className="warn">Report couldn&apos;t be generated: {error}</div>}
      {report && !loading && (
        <div className="report-text markdown"><ReactMarkdown>{body}</ReactMarkdown></div>
      )}
    </div>
  );
}
