"use client";

import ReactMarkdown from "react-markdown";
import { BarrierResponse, Factor, GreenwashResponse, Lang, Prediction, SentimentResponse, Source } from "@/lib/types";
import { PLATFORM_RELIABILITY, GLOSSARY } from "@/lib/config";
import { useT, factorLabel, TFunc } from "@/lib/i18n";

function labelText(t: TFunc, label: string): string {
  if (label === "viral-likely") return t("lbl.viral");
  if (label === "not-viral") return t("lbl.notviral");
  return label;
}

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
  leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z M2 21c0-3 1.9-5.4 5.1-6",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z",
  close: "M18 6 6 18 M6 6l12 12",
};

export function Icon({ name, size = 18 }: { name: keyof typeof PATHS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name].split(" M").map((seg, i) => <path key={i} d={(i === 0 ? "" : "M") + seg} />)}
    </svg>
  );
}

export function InfoTip({ term }: { term: keyof typeof GLOSSARY }) {
  const { t } = useT();
  const text = t(`gloss.${term}`);
  return (
    <span className="tip" tabIndex={0} aria-label={text}>
      i<span className="tip-bubble">{text}</span>
    </span>
  );
}

export const NET_NAMES: Record<string, string> = { youtube: "YouTube", x: "X", reddit: "Reddit" };

export function NetworkCompare({ results, selected, onSelect }: {
  results: { source: Source; prediction: Prediction }[];
  selected: Source;
  onSelect: (s: Source) => void;
}) {
  const { t } = useT();
  const best = results.reduce((a, b) => (b.prediction.viral_score > a.prediction.viral_score ? b : a), results[0]);
  const sorted = [...results].sort((a, b) => b.prediction.viral_score - a.prediction.viral_score);
  return (
    <div className="card" style={{ marginBottom: "1.25rem" }}>
      <div className="section-title"><Icon name="chart" /> {t("cmp.pernet")}</div>
      <div className="net-grid">
        {sorted.map((r) => {
          const pct = Math.round(r.prediction.viral_score * 100);
          const rel = Math.round((PLATFORM_RELIABILITY[r.source] ?? PLATFORM_RELIABILITY[""]) * 100);
          const isViral = r.prediction.viral_score >= 0.5;
          return (
            <button key={r.source} className={`net-card${r.source === selected ? " active" : ""}`} onClick={() => onSelect(r.source)}>
              {r.source === best.source && <span className="net-best">{t("cmp.best")}</span>}
              <div className="net-name">{NET_NAMES[r.source]}</div>
              <div className={`net-score${isViral ? "" : " low"}`}>{pct}%</div>
              <div className="net-sub">{labelText(t, r.prediction.label)} · {t("cmp.reliability", rel)}</div>
            </button>
          );
        })}
      </div>
      <div className="net-hint">{t("cmp.clicknet")}</div>
    </div>
  );
}

function pretty(lang: Lang, f: Factor) {
  return factorLabel(lang, f.feature, f.label);
}

// Hide platform indicators (src_*) from the factor lists: they reflect the
// model's baseline per-platform rate, are not actionable for a marketer, and
// confuse the breakdown. We keep only factors the user can actually act on.
function relevant(factors: Factor[]): Factor[] {
  return factors.filter((f) => !f.feature.startsWith("src_"));
}

export function ScoreGauge({ prediction }: { prediction: Prediction }) {
  const { t } = useT();
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
        <div className="gauge-label">{t("cmp.viralprob")} <InfoTip term="probability" /></div>
        <div className="badge">{labelText(t, prediction.label)}</div>
      </div>
    </div>
  );
}

export function MetaGrid({ prediction, source }: { prediction: Prediction; source: Source }) {
  const { t } = useT();
  const conf = Math.round(prediction.confidence * 100);
  const rel = PLATFORM_RELIABILITY[source] ?? PLATFORM_RELIABILITY[""];
  const relPct = Math.round(rel * 100);
  const weak = rel < 0.75;
  return (
    <>
      <div className="metric">
        <div className="label"><span className="ico-badge teal"><Icon name="target" size={15} /></span>{t("cmp.confidence")} <InfoTip term="confidence" /></div>
        <div className="value">{conf}%</div>
        <div className="sub">{t("cmp.conf.sub")}</div>
      </div>
      <div className="metric">
        <div className="label"><span className={`ico-badge ${weak ? "amber" : "green"}`}><Icon name="shield" size={15} /></span>{t("cmp.platrel")} <InfoTip term="reliability" /></div>
        <div className="value">{relPct}%</div>
        <div className="sub">{source ? t("cmp.rel.on", source) : t("cmp.rel.overall")}{weak ? t("cmp.rel.weak") : ""}</div>
      </div>
    </>
  );
}

export function SummaryBox({ factors }: { factors: Factor[] }) {
  const { t, lang } = useT();
  const rel = relevant(factors);
  const up = rel.filter((f) => f.direction === "up");
  const down = rel.filter((f) => f.direction === "down");
  return (
    <div className="card summary-card">
      <div className="section-title"><Icon name="list" /> {t("cmp.summary")}</div>
      <div className="summary-cols">
        <div>
          <div className="sum-head up"><Icon name="up" size={15} /> {t("cmp.helping")}</div>
          {up.length ? up.map((f) => <div className="sum-item" key={f.feature}>{pretty(lang, f)}</div>) : <div className="sum-item muted">—</div>}
        </div>
        <div>
          <div className="sum-head down"><Icon name="down" size={15} /> {t("cmp.holding")}</div>
          {down.length ? down.map((f) => <div className="sum-item" key={f.feature}>{pretty(lang, f)}</div>) : <div className="sum-item muted">—</div>}
        </div>
      </div>
    </div>
  );
}

export function FactorBars({ factors }: { factors: Factor[] }) {
  const { t, lang } = useT();
  const rel = relevant(factors);
  const max = Math.max(...rel.map((f) => Math.abs(f.contribution)), 0.0001);
  const sorted = [...rel].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  return (
    <div className="card">
      <div className="section-title"><Icon name="chart" /> {t("cmp.why")} <InfoTip term="factors" /></div>
      <div className="ibars">
        {sorted.map((f) => {
          const ratio = Math.abs(f.contribution) / max;
          const up = f.direction === "up";
          const tag = up ? (ratio >= 0.6 ? t("cmp.tag.strong") : ratio >= 0.3 ? t("cmp.tag.medium") : t("cmp.tag.minor")) : t("cmp.tag.hurts");
          return (
            <div className="ibar-row" key={f.feature}>
              <span className="ibar-name">{pretty(lang, f)}</span>
              <div className="ibar-track"><div className={`ibar-fill ${f.direction}`} style={{ width: `${Math.max(5, ratio * 100)}%` }} /></div>
              <span className={`ibar-tag ${f.direction}`}>{up ? "▲" : "▼"} {tag}</span>
            </div>
          );
        })}
      </div>
      <div className="ibar-legend">
        <span><span className="dot up" />{t("cmp.leg.up")}</span>
        <span><span className="dot down" />{t("cmp.leg.down")}</span>
        <span className="ibar-hint">{t("cmp.leg.hint")}</span>
      </div>
    </div>
  );
}

export function Suggestions({ items }: { items: string[] }) {
  const { t } = useT();
  if (!items?.length) return null;
  return (
    <div className="card">
      <div className="section-title"><Icon name="bulb" /> {t("cmp.suggestions")}</div>
      <ul className="sugg-list">
        {items.map((s, i) => (
          <li key={i}><span className="sugg-ico"><Icon name="check" size={16} /></span><span>{s}</span></li>
        ))}
      </ul>
    </div>
  );
}

const BARRIER_PRIORITY = ["range_anxiety", "charging_infrastructure", "price_incentives", "battery_degradation", "safety_fire", "maintenance_cost"];

export function BarrierRadar({ data, loading, error }: { data: BarrierResponse | null; loading: boolean; error: string | null }) {
  const { t } = useT();
  const barLabel = (key: string, fallback: string) => {
    const s = t(`bar.key.${key}`);
    return s === `bar.key.${key}` ? fallback : s;
  };
  const focus = data
    ? data.barriers
        .filter((b) => b.status !== "addressed")
        .sort((a, b) => BARRIER_PRIORITY.indexOf(a.key) - BARRIER_PRIORITY.indexOf(b.key))
        .slice(0, 2)
    : [];
  return (
    <div className="card">
      <div className="section-title"><Icon name="shield" /> {t("bar.title")} <InfoTip term="barriers" /></div>
      {loading && <div className="loading-row"><span className="spinner" />{t("bar.loading")}</div>}
      {error && !loading && <div className="warn">{t("bar.err", error)}</div>}
      {data && !loading && (
        <>
          <div className="barrier-list">
            {data.barriers.map((b) => (
              <div className="barrier-row" key={b.key}>
                <span className="barrier-name">{barLabel(b.key, b.label)}</span>
                <span className={`barrier-badge ${b.status}`}>{t(`bar.status.${b.status}`)}</span>
              </div>
            ))}
          </div>
          {focus.length > 0 && (
            <div className="barrier-focus">
              <Icon name="bulb" size={15} /> {t("bar.focus")} <strong>{focus.map((f) => barLabel(f.key, f.label)).join(", ")}</strong>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function GreenwashCard({ data, loading, error }: { data: GreenwashResponse | null; loading: boolean; error: string | null }) {
  const { t } = useT();
  return (
    <div className="card">
      <div className="section-title"><Icon name="leaf" /> {t("gw.title")} <InfoTip term="greenwashing" /></div>
      {loading && <div className="loading-row"><span className="spinner" />{t("gw.loading")}</div>}
      {error && !loading && <div className="warn">{t("gw.err", error)}</div>}
      {data && !loading && (
        <>
          <span className={`risk-badge ${data.risk}`}>{t(`gw.risk.${data.risk}`)}</span>
          {data.note && <p className="gw-note">{data.note}</p>}
          <div className="gw-cols">
            <div>
              <div className="gw-head">{t("gw.claims", data.claims.length)}</div>
              {data.claims.length ? <ul className="gw-list">{data.claims.map((c, i) => <li key={i}>{c}</li>)}</ul> : <div className="gw-empty">{t("gw.none")}</div>}
            </div>
            <div>
              <div className="gw-head">{t("gw.evidence", data.evidence.length)}</div>
              {data.evidence.length ? <ul className="gw-list">{data.evidence.map((e, i) => <li key={i}>{e}</li>)}</ul> : <div className="gw-empty">{t("gw.none")}</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function SentimentCard({ data, loading, error }: { data: SentimentResponse | null; loading: boolean; error: string | null }) {
  const { t } = useT();
  return (
    <div className="card">
      <div className="section-title"><Icon name="chat" /> {t("se.title")} <InfoTip term="reaction" /></div>
      {loading && <div className="loading-row"><span className="spinner" />{t("se.loading")}</div>}
      {error && !loading && <div className="warn">{t("se.err", error)}</div>}
      {data && !loading && (
        <>
          <span className={`reaction-badge ${data.reaction}`}>{t(`se.${data.reaction}`)}</span>
          {data.note && <p className="gw-note">{data.note}</p>}
        </>
      )}
    </div>
  );
}

export function AnalysisDetail({ post, scoresLine, source, prediction, barriers, greenwash, sentiment, report }: {
  post?: string;
  scoresLine?: string;
  source: Source;
  prediction: Prediction;
  barriers?: BarrierResponse | null;
  greenwash?: GreenwashResponse | null;
  sentiment?: SentimentResponse | null;
  report?: string | null;
}) {
  const { t } = useT();
  return (
    <>
      {(post || scoresLine) && (
        <div className="preview" style={{ marginBottom: "1.25rem" }}>
          {post && <><div className="lbl">{t("detail.analyzedpost")}</div><div className="txt">{post}</div></>}
          {scoresLine && <div className="tags">{scoresLine}</div>}
        </div>
      )}
      <div className="metrics">
        <ScoreGauge prediction={prediction} />
        <MetaGrid prediction={prediction} source={source} />
      </div>
      <SummaryBox factors={prediction.top_factors} />
      {(barriers || greenwash) && (
        <div className="cols">
          {barriers && <BarrierRadar data={barriers} loading={false} error={null} />}
          {greenwash && <GreenwashCard data={greenwash} loading={false} error={null} />}
        </div>
      )}
      {sentiment && <div style={{ marginBottom: "1.25rem" }}><SentimentCard data={sentiment} loading={false} error={null} /></div>}
      <div className="stack">
        <FactorBars factors={prediction.top_factors} />
        {report && <ReportPanel report={report} loading={false} error={null} />}
      </div>
    </>
  );
}

export function ReportPanel({ report, loading, error, onTranslate, translateLabel }: { report: string | null; loading: boolean; error: string | null; onTranslate?: () => void; translateLabel?: string }) {
  const { t } = useT();
  const body = report ? report.replace(/^\s*#{0,6}\s*report\s*\r?\n+/i, "").trim() : "";
  return (
    <div className="card">
      <div className="section-title"><Icon name="file" /> {t("rep.title")}</div>
      {loading && (
        <div className="skeleton">
          <span style={{ width: "90%" }} /><span style={{ width: "97%" }} /><span style={{ width: "80%" }} /><span style={{ width: "60%" }} />
          <div className="loading-row" style={{ marginTop: 6 }}><span className="spinner" />{t("rep.loading")}</div>
        </div>
      )}
      {error && !loading && <div className="warn">{t("rep.err", error)}</div>}
      {report && !loading && (
        <>
          <div className="report-text markdown"><ReactMarkdown>{body}</ReactMarkdown></div>
          {onTranslate && translateLabel && (
            <button className="btn-ghost" style={{ marginTop: 14 }} onClick={onTranslate}>{translateLabel}</button>
          )}
        </>
      )}
    </div>
  );
}
