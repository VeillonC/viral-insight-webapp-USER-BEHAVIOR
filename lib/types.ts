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
