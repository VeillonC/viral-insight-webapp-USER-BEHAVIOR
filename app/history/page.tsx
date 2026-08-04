"use client";

import { useEffect, useMemo, useState } from "react";
import { getHistory, deleteHistory, clearHistory, HistoryItem } from "@/lib/history";
import { Source } from "@/lib/types";
import { modelName } from "@/lib/config";
import { AnalysisDetail, Icon } from "../components";

const NAMES: Record<string, string> = { youtube: "YouTube", x: "X", reddit: "Reddit" };
const pct = (v?: number) => (v == null ? "—" : `${Math.round(v * 100)}%`);

function TrendChart({ items }: { items: HistoryItem[] }) {
  const data = [...items].sort((a, b) => a.ts - b.ts);
  if (data.length < 2) return null;
  const W = 600, H = 150, padX = 40, padY = 16, plotW = W - 2 * padX, plotH = H - 2 * padY - 12;
  const n = data.length;
  const x = (i: number) => padX + (i / (n - 1)) * plotW;
  const y = (s: number) => padY + (1 - s) * plotH;
  const pts = data.map((d, i) => `${x(i)},${y(d.best.score)}`).join(" ");
  return (
    <div className="card" style={{ marginBottom: "1.25rem" }}>
      <div className="section-title"><Icon name="chart" /> Score trend</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Trend of viral scores over your past analyses">
        <line x1={padX} y1={y(1)} x2={W - padX} y2={y(1)} stroke="var(--border)" />
        <line x1={padX} y1={y(0.5)} x2={W - padX} y2={y(0.5)} stroke="var(--border)" strokeDasharray="4 4" />
        <line x1={padX} y1={y(0)} x2={W - padX} y2={y(0)} stroke="var(--border)" />
        <text x={padX - 8} y={y(1) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">100%</text>
        <text x={padX - 8} y={y(0.5) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">50%</text>
        <text x={padX - 8} y={y(0) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">0%</text>
        <polyline points={pts} fill="none" stroke="#15803d" strokeWidth="2" />
        {data.map((d, i) => <circle key={i} cx={x(i)} cy={y(d.best.score)} r="4" fill={d.best.score >= 0.5 ? "#15803d" : "#e0a03a"} />)}
      </svg>
      <div className="hist-meta">Best-network viral score across your {n} analyses (oldest → newest).</div>
    </div>
  );
}

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<"date" | "score">("date");
  const [openItem, setOpenItem] = useState<HistoryItem | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => { setItems(getHistory()); }, []);
  useEffect(() => { setPage(1); }, [query, filter, sort]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let a = items.filter((i) => i.text.toLowerCase().includes(q) || (i.title ?? "").toLowerCase().includes(q));
    if (filter !== "all") a = a.filter((i) => i.best.source === filter);
    a = [...a].sort((x, y) => (sort === "date" ? y.ts - x.ts : y.best.score - x.best.score));
    return a;
  }, [items, query, filter, sort]);

  function onDelete(id: string) { deleteHistory(id); setItems(getHistory()); }
  function onClear() { if (confirm("Delete all saved analyses?")) { clearHistory(); setItems([]); } }

  function exportCsv() {
    const head = ["date", "title", "text", "best_network", "best_score", "youtube", "x", "reddit"];
    const rows = filtered.map((i) => [
      new Date(i.ts).toISOString(),
      `"${(i.title ?? "").replace(/"/g, '""')}"`,
      `"${i.text.replace(/"/g, '""')}"`,
      i.best.source, pct(i.best.score),
      pct(i.scores.youtube), pct(i.scores.x), pct(i.scores.reddit),
    ].join(","));
    const csv = [head.join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "ev-analysis-history.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const scoresLine = (i: HistoryItem) =>
    `YouTube ${pct(i.scores.youtube)} · X ${pct(i.scores.x)} · Reddit ${pct(i.scores.reddit)} · Best: ${NAMES[i.best.source]} · Model: ${modelName(i.model)}`;

  return (
    <>
      <h1 className="page-title">History</h1>
      <p className="page-subtitle">Your past analyses, saved on this device. Search, filter, sort and export.</p>

      {items.length === 0 ? (
        <div className="card"><div className="placeholder">No analyses yet. Run one from the Analyze page and it&apos;ll appear here.</div></div>
      ) : (
        <>
          <div className="hist-controls">
            <input placeholder="Search name or text…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ maxWidth: 260 }} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 170 }}>
              <option value="all">All networks</option>
              <option value="youtube">Best on YouTube</option>
              <option value="x">Best on X</option>
              <option value="reddit">Best on Reddit</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as "date" | "score")} style={{ maxWidth: 170 }}>
              <option value="date">Sort: newest</option>
              <option value="score">Sort: highest score</option>
            </select>
            <div style={{ flex: 1 }} />
            <button className="btn-ghost" onClick={exportCsv}>Export CSV</button>
            <button className="btn-ghost" onClick={onClear}>Clear all</button>
          </div>

          <TrendChart items={items} />

          <div className="stack">
            {pageItems.map((i) => (
              <div className="card hist-item" key={i.id}>
                <div className="hist-row">
                  <span className="ex-score" style={{ color: i.best.score >= 0.5 ? "var(--accent-dark)" : "var(--down)", fontSize: "24px" }}>{pct(i.best.score)}</span>
                  <div className="hist-main">
                    {i.title && <div className="hist-title">{i.title}</div>}
                    <div className="hist-text">{i.text}</div>
                    <div className="hist-meta">
                      Best: {NAMES[i.best.source]} · YouTube {pct(i.scores.youtube)} · X {pct(i.scores.x)} · Reddit {pct(i.scores.reddit)} · {modelName(i.model)} · {new Date(i.ts).toLocaleString()}
                    </div>
                  </div>
                  <div className="hist-actions">
                    {i.prediction && <button className="link-x" onClick={() => setOpenItem(i)}>view full analysis</button>}
                    <button className="link-x" onClick={() => onDelete(i.id)}>delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pager">
              <button className="btn-ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageSafe <= 1}>← Previous</button>
              <span className="pager-info">Page {pageSafe} of {totalPages}</span>
              <button className="btn-ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageSafe >= totalPages}>Next →</button>
            </div>
          )}
        </>
      )}

      {openItem && openItem.prediction && (
        <div className="modal-overlay" onClick={() => setOpenItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">{openItem.title || "Analysis"}</span>
              <button className="modal-close" onClick={() => setOpenItem(null)} aria-label="Close">✕</button>
            </div>
            <AnalysisDetail
              post={openItem.text}
              scoresLine={scoresLine(openItem)}
              source={(openItem.source ?? openItem.best.source) as Source}
              prediction={openItem.prediction}
              barriers={openItem.barriers}
              greenwash={openItem.greenwash}
              sentiment={openItem.sentiment}
              report={openItem.report}
            />
          </div>
        </div>
      )}
    </>
  );
}
