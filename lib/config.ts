// Static domain config surfaced in the UI.

// The model classifies a post as "viral-likely" when the score is at/above this.
export const DECISION_THRESHOLD = 0.5;

// Available prediction models. Add new entries here as more models are trained;
// the analyze selector, insights page and history all read from this list.
export interface ModelInfo {
  id: string;
  name: string;
  blurb: string;
  reliability: Record<string, number>; // ROC-AUC per platform ("" = overall)
}
export const MODELS: ModelInfo[] = [
  {
    id: "fusion-v1",
    name: "Fusion v1",
    blurb: "Content, audience, marketing roles and topics combined (XGBoost). Balanced default across networks.",
    reliability: { youtube: 0.92, reddit: 0.76, x: 0.72, "": 0.84 },
  },
];
export const DEFAULT_MODEL_ID = "fusion-v1";
export const modelName = (id?: string) => MODELS.find((m) => m.id === id)?.name ?? MODELS[0].name;

// Reliability of the default model, kept for the metric cards / network comparison.
export const PLATFORM_RELIABILITY: Record<string, number> = MODELS[0].reliability;

// Short explanations shown in tooltips (ℹ️) next to technical terms.
export const GLOSSARY: Record<string, string> = {
  probability: "Estimated chance the post goes viral, from the model (0-100%).",
  confidence: "How sure the model is about its call — based on how far the score is from the 0.5 threshold.",
  threshold: "Decision line: at or above 0.5 the post is labelled viral-likely, below it not-viral.",
  reliability: "How well the model performs on this platform (ROC-AUC on the test set). Lower = take the result with a pinch of salt.",
  factors: "The features that pushed the score up (green) or down (amber), ranked by impact (SHAP).",
  audience: "Follower / subscriber count of the account posting. Bigger audience usually means more reach.",
  barriers: "The six common reasons people hesitate to buy an EV. A strong post addresses the most relevant ones.",
  greenwashing: "Risk the post is seen as making vague or exaggerated eco claims without concrete evidence.",
  reaction: "How the audience is likely to respond to the post — from positive to hostile.",
};

// One-click green-marketing snippets the user can insert into a post, by rhetorical role.
export const TEMPLATES: { role: string; text: string }[] = [
  { role: "Proof", text: "Tested: 510 km per charge under mixed urban/highway conditions." },
  { role: "Objection handling", text: "Worried about charging? More than 3,000 charging stations are available nationwide." },
  { role: "Social proof", text: "Over 25,000 customers have already switched to electric vehicles this year." },
  { role: "Hook", text: "Still paying for petrol every week? Here's what switching to electric really changes." },
  { role: "Call to action", text: "Book a free test drive this week and feel the difference yourself." },
];
