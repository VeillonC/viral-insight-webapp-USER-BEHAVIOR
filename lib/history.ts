export interface HistoryItem {
  id: string;
  ts: number;
  title?: string;
  text: string;
  scores: { youtube?: number; x?: number; reddit?: number };
  best: { source: string; score: number; label: string };
  report?: string;
}

const KEY = "evca_history";

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
