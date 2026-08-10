import { BarrierResponse, GreenwashResponse, Lang, Prediction, PredictionModel, ReportJobResponse, ReportResponse, SentimentResponse, Source } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://100.70.0.2:8000";
const REPORT_POLL_INTERVAL_MS = 1_000;
const REPORT_POLL_TIMEOUT_MS = 10 * 60 * 1_000;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new ApiError(res.status, `API ${res.status}: ${detail || res.statusText}`);
  }
  return res.json();
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<T>(res);
}

async function getJson<T>(path: string): Promise<T> {
  return parseJson<T>(await fetch(`${API_URL}${path}`));
}

// Fast: prediction only (score, factors, suggestions). Returns almost instantly.
export function predict(text: string, source: Source, audience: number | null, model: PredictionModel = "legacy") {
  return postJson<Prediction>("/predict", { text, source, audience, model });
}

// Slow: enqueue the Qwen report, then poll with short requests so proxies do not
// have to keep one long HTTP connection alive. Older servers fall back to /report.
export async function getReport(
  text: string,
  source: Source,
  audience: number | null,
  lang: Lang,
  model: PredictionModel = "legacy",
  onProgress?: (job: ReportJobResponse) => void,
): Promise<ReportResponse> {
  const body = { text, source, audience, lang, model };
  let job: ReportJobResponse;
  try {
    job = await postJson<ReportJobResponse>("/report/jobs", body);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return postJson<ReportResponse>("/report", body);
    }
    throw error;
  }

  const deadline = Date.now() + REPORT_POLL_TIMEOUT_MS;
  let consecutiveNetworkErrors = 0;
  while (Date.now() < deadline) {
    onProgress?.(job);
    if (job.status === "succeeded") {
      if (!job.result) throw new Error("Report job succeeded without a result");
      return job.result;
    }
    if (job.status === "failed") {
      throw new Error(job.error || "Report generation failed");
    }

    await new Promise((resolve) => setTimeout(resolve, REPORT_POLL_INTERVAL_MS));
    try {
      job = await getJson<ReportJobResponse>(`/report/jobs/${encodeURIComponent(job.job_id)}`);
      consecutiveNetworkErrors = 0;
    } catch (error) {
      if (error instanceof ApiError || ++consecutiveNetworkErrors >= 3) throw error;
    }
  }
  throw new Error("Report queue timed out after 10 minutes");
}

// Batch: predict many posts at once (used by the Variant lab).
export function predictBatch(items: { text: string; source: Source; audience: number | null; model?: PredictionModel }[]) {
  return postJson<Prediction[]>("/predict/batch", { items });
}

// EV adoption barrier radar (via Qwen). Depends on the post text only.
export function getBarriers(text: string) {
  return postJson<BarrierResponse>("/barriers", { text });
}

// Greenwashing risk (via Qwen). The explanatory note is written in `lang`.
export function getGreenwashing(text: string, lang: Lang) {
  return postJson<GreenwashResponse>("/greenwashing", { text, lang });
}

// Likely audience reaction (via Qwen). The explanatory note is written in `lang`.
export function getSentiment(text: string, lang: Lang) {
  return postJson<SentimentResponse>("/sentiment", { text, lang });
}
