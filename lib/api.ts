import { Lang, ReportResponse, Source } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://100.70.0.2:8000";

// Calls the AI-server /report endpoint: one call returns both the prediction
// (score, factors, suggestions) and the LLM-generated report text.
export async function analyze(
  text: string,
  source: Source,
  audience: number | null,
  lang: Lang
): Promise<ReportResponse> {
  const res = await fetch(`${API_URL}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, audience, lang }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${detail || res.statusText}`);
  }
  return res.json();
}
