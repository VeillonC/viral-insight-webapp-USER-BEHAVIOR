import { BarrierResponse, GreenwashResponse, Prediction, SentimentResponse, Source } from "./types";

export type AnalysisStatus = "pending" | "running" | "completed" | "failed";
export interface StoredAudiences {
  youtube: number | null;
  x: number | null;
  reddit: number | null;
}

export interface HistoryItem {
  id: string;
  ts: number;
  status?: AnalysisStatus;
  error?: string;
  title?: string;
  text: string;
  model?: string;
  audiences?: StoredAudiences;
  source?: Source;
  scores?: { youtube?: number; x?: number; reddit?: number };
  best?: { source: string; score: number; label: string };
  prediction?: Prediction;
  barriers?: BarrierResponse;
  greenwash?: GreenwashResponse;
  sentiment?: SentimentResponse;
  report?: string;
}

const KEY = "evca_history";
const DRAFT_KEY = "evca_analysis_draft";

export function historyStatus(item: HistoryItem): AnalysisStatus {
  return item.status ?? "completed";
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: HistoryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addHistory(item: HistoryItem) {
  const a = getHistory();
  a.unshift(item);
  save(a.slice(0, 200));
}

export function updateHistory(id: string, patch: Partial<HistoryItem>) {
  save(getHistory().map((x) => (x.id === id ? { ...x, ...patch } : x)));
}

export function deleteHistory(id: string) {
  save(getHistory().filter((x) => x.id !== id));
}

export function clearHistory() {
  save([]);
}

export function saveAnalysisDraft(item: HistoryItem) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    title: item.title ?? "",
    text: item.text,
    model: item.model,
    audiences: item.audiences,
  }));
}

export function consumeAnalysisDraft(): Pick<HistoryItem, "title" | "text" | "model" | "audiences"> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    localStorage.removeItem(DRAFT_KEY);
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(DRAFT_KEY);
    return null;
  }
}
