import { GLOSSARY } from "@/lib/config";

const EXTRA: { term: string; def: string }[] = [
  { term: "Viral score", def: "The model's estimate of how likely a post is to spread widely, from 0 to 100%." },
  { term: "ROC-AUC", def: "A standard accuracy measure for the model — higher means it ranks viral vs non-viral posts better." },
  { term: "SHAP", def: "A method that attributes the prediction to each input factor, so we can explain why a score is high or low." },
  { term: "Content theme", def: "The topic the post is about, learned automatically from the text." },
];

const NAMES: Record<string, string> = {
  probability: "Viral probability",
  confidence: "Confidence",
  threshold: "Decision threshold",
  reliability: "Platform reliability",
  factors: "Factors",
  audience: "Audience",
};

export default function Glossary() {
  const items = [
    ...Object.entries(GLOSSARY).map(([k, def]) => ({ term: NAMES[k] ?? k, def })),
    ...EXTRA,
  ];
  return (
    <>
      <h1 className="page-title">Glossary</h1>
      <p className="page-subtitle">Plain-language definitions of the terms used across the app.</p>
      <div className="card">
        <dl className="gloss">
          {items.map((it) => (
            <div className="gloss-item" key={it.term}>
              <dt>{it.term}</dt>
              <dd>{it.def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
