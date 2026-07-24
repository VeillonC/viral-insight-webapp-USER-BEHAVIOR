import ReactMarkdown from "react-markdown";
import { Factor, Prediction } from "@/lib/types";

export function ScoreCard({ prediction }: { prediction: Prediction }) {
  const pct = Math.round(prediction.viral_score * 100);
  const conf = Math.round(prediction.confidence * 100);
  const isViral = prediction.label === "viral-likely";
  return (
    <div className="grid-2" style={{ marginBottom: "1rem" }}>
      <div className={`score${isViral ? "" : " low"}`}>
        <div className="label">Viral score</div>
        <div className="value">{pct}%</div>
        <div className="badge">{prediction.label}</div>
      </div>
      <div className="meta">
        <div className="label">Confidence</div>
        <div className="value">{conf}%</div>
      </div>
    </div>
  );
}

export function FactorBars({ factors }: { factors: Factor[] }) {
  const max = Math.max(...factors.map((f) => Math.abs(f.contribution)), 0.0001);
  return (
    <div className="card">
      <div className="section-title">Why</div>
      {factors.map((f) => (
        <div className="factor" key={f.feature}>
          <span className="name">{f.label}</span>
          <div
            className={`bar ${f.direction}`}
            style={{ width: `${Math.max(6, (Math.abs(f.contribution) / max) * 100)}%` }}
          />
        </div>
      ))}
      <div className="legend">
        <span><span className="dot" style={{ background: "var(--success-bg)" }} />pushes viral</span>
        <span><span className="dot" style={{ background: "var(--danger-bg)" }} />holds it back</span>
      </div>
    </div>
  );
}

export function ResultPanels({ prediction, report }: { prediction: Prediction; report: string }) {
  const body = report.replace(/^\s*#{0,6}\s*report\s*\r?\n+/i, "").trim();
  return (
    <div className="grid-2">
      <div className="card">
        <div className="section-title">Suggestions</div>
        {prediction.suggestions.map((s, i) => (
          <div className="sugg" key={i}>
            <span className="plus">+</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-title">Report</div>
        <div className="report-text markdown">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
