import { Lang, Prediction, ReportResponse, Source } from "./types";

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
