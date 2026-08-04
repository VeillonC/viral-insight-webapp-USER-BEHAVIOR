export type Source = "youtube" | "x" | "reddit" | "";
export type Lang = "en" | "vi";

export interface Factor {
  feature: string;
  label: string;
  value: number | null;
  contribution: number;
  direction: "up" | "down";
}

export interface Prediction {
  viral_score: number;
  label: string;
  confidence: number;
  top_factors: Factor[];
  explanation_text: string;
  suggestions: string[];
}

export interface ReportResponse {
  report: string;
  prediction: Prediction;
}

export type BarrierStatus = "addressed" | "mentioned" | "not_mentioned";
export interface Barrier {
  key: string;
  label: string;
  status: BarrierStatus;
}
export interface BarrierResponse {
  barriers: Barrier[];
  recommend: string[];
}

export type RiskLevel = "low" | "medium" | "high";
export interface GreenwashResponse {
  risk: RiskLevel;
  claims: string[];
  evidence: string[];
  note: string;
}

export type Reaction = "positive" | "neutral" | "skeptical" | "hostile";
export interface SentimentResponse {
  reaction: Reaction;
  note: string;
}
