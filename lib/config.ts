// Static domain config surfaced in the UI.

// The model classifies a post as "viral-likely" when the score is at/above this.
export const DECISION_THRESHOLD = 0.5;

// Model reliability per platform (ROC-AUC from the latest evaluation).
// Used to warn users when a prediction is less reliable (e.g. X has little data).
export const PLATFORM_RELIABILITY: Record<string, number> = {
  youtube: 0.92,
  reddit: 0.76,
  x: 0.72,
  "": 0.84,
};

// Short explanations shown in tooltips (ℹ️) next to technical terms.
export const GLOSSARY: Record<string, string> = {
  probability: "Estimated chance the post goes viral, from the model (0-100%).",
  confidence: "How sure the model is about its call — based on how far the score is from the 0.5 threshold.",
  threshold: "Decision line: at or above 0.5 the post is labelled viral-likely, below it not-viral.",
  reliability: "How well the model performs on this platform (ROC-AUC on the test set). Lower = take the result with a pinch of salt.",
  factors: "The features that pushed the score up (green) or down (amber), ranked by impact (SHAP).",
  audience: "Follower / subscriber count of the account posting. Bigger audience usually means more reach.",
};
