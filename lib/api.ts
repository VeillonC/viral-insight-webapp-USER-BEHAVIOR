import { BarrierResponse, GreenwashResponse, Lang, Prediction, ReportResponse, SentimentResponse, Source } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://100.70.0.2:8000";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${detail || res.statusText}`);
  }
  return res.json();
}

// Fast: prediction only (score, factors, suggestions). Returns almost instantly.
export function predict(text: string, source: Source, audience: number | null) {
  return postJson<Prediction>("/predict", { text, source, audience });
}

// Slow: LLM-generated report (Qwen). Called after predict, loads in the background.
export function getReport(text: string, source: Source, audience: number | null, lang: Lang) {
  return postJson<ReportResponse>("/report", { text, source, audience, lang });
}

// Batch: predict many posts at once (used by the Variant lab).
export function predictBatch(items: { text: string; source: Source; audience: number | null }[]) {
  return postJson<Prediction[]>("/predict/batch", { items });
}

// EV adoption barrier radar (via Qwen). Depends on the post text only.
export function getBarriers(text: string) {
  return postJson<BarrierResponse>("/barriers", { text });
}

// Greenwashing risk (via Qwen). Depends on the post text only.
export function getGreenwashing(text: string) {
  return postJson<GreenwashResponse>("/greenwashing", { text });
}

// Likely audience reaction (via Qwen). Depends on the post text only.
export function getSentiment(text: string) {
  return postJson<SentimentResponse>("/sentiment", { text });
}
