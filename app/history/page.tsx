"use client";

import { useEffect, useMemo, useState } from "react";
import { getHistory, deleteHistory, clearHistory, HistoryItem } from "@/lib/history";
import { Source } from "@/lib/types";
import { AnalysisDetail } from "../components";

const NAMES: Record<string, string> = { youtube: "YouTube", x: "X", reddit: "Reddit" };
const pct = (v?: number) => (v == null ? "—" : `${Math.round(v * 100)}%`);

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<"date" | "score">("date");
  const [openItem, setOpenItem] = useState<HistoryItem | null>(null);

  useEffect(() => { setItems(getHistory()); }, []);

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

  const scoresLine = (i: HistoryItem) =>
    `YouTube ${pct(i.scores.youtube)} · X ${pct(i.scores.x)} · Reddit ${pct(i.scores.reddit)} · Best: ${NAMES[i.best.source]}`;

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

          <div className="stack">
            {filtered.map((i) => (
              <div className="card hist-item" key={i.id}>
                <div className="hist-row">
                  <span className="ex-score" style={{ color: i.best.score >= 0.5 ? "var(--accent-dark)" : "var(--down)", fontSize: "24px" }}>{pct(i.best.score)}</span>
                  <div className="hist-main">
                    {i.title && <div className="hist-title">{i.title}</div>}
                    <div className="hist-text">{i.text}</div>
                    <div className="hist-meta">
                      Best: {NAMES[i.best.source]} · YouTube {pct(i.scores.youtube)} · X {pct(i.scores.x)} · Reddit {pct(i.scores.reddit)} · {new Date(i.ts).toLocaleString()}
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
