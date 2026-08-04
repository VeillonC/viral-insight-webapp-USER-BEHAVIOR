"use client";

import { useState } from "react";
import { Prediction, BarrierResponse, GreenwashResponse, SentimentResponse, Source } from "@/lib/types";
import { AnalysisDetail } from "./components";

interface Example {
  score: string;
  scoreColor: string;
  net: string;
  snippet: string;
  body: string;
  full: {
    post: string;
    scoresLine: string;
    source: Source;
    prediction: Prediction;
    barriers: BarrierResponse;
    greenwash: GreenwashResponse;
    sentiment: SentimentResponse;
    report: string;
  };
}

const EXAMPLES: Example[] = [
  {
    score: "83%",
    scoreColor: "var(--accent-dark)",
    net: "YouTube — viral-likely",
    snippet: "\"New electric SUV — 510 km range…\"",
    body: "A large channel audience and strong, on-topic content drive it up, while high urgency holds it back. Backed by concrete proof, so greenwashing risk stays low.",
    full: {
      post: "New electric SUV — independently tested at 510 km of range on a single charge. Charge 10–80% in 18 minutes at 3,200 fast-charging stations nationwide, with an 8-year / 200,000 km battery warranty. Book your free test drive today.",
      scoresLine: "Audiences: YouTube 800k · X 40k · Reddit 350k  →  best on YouTube (83%)",
      source: "youtube",
      prediction: {
        viral_score: 0.83, label: "viral-likely", confidence: 0.66,
        top_factors: [
          { feature: "chan_log_audience", label: "Channel audience size", value: 13.6, contribution: 1.9, direction: "up" },
          { feature: "content_score", label: "Post content/topic", value: 0.6, contribution: 0.63, direction: "up" },
          { feature: "role_ratio_urgency", label: "Ratio of urgency", value: 1, contribution: -0.25, direction: "down" },
          { feature: "src_youtube", label: "Platform youtube", value: 1, contribution: -0.28, direction: "down" },
          { feature: "cognitive_friction_score", label: "Reading difficulty", value: 0.4, contribution: -0.21, direction: "down" },
        ],
        explanation_text: "Prediction: likely viral (probability 83%). Factors increasing it: Channel audience size, Post content/topic. Factors decreasing it: Platform youtube, Ratio of urgency, Reading difficulty.",
        suggestions: ["Add a clear call to action (CTA).", "Open with an attention-grabbing hook.", "Add concrete numbers or proof."],
      },
      barriers: {
        barriers: [
          { key: "range_anxiety", label: "Range anxiety", status: "addressed" },
          { key: "charging_infrastructure", label: "Charging infrastructure", status: "addressed" },
          { key: "battery_degradation", label: "Battery degradation", status: "mentioned" },
          { key: "safety_fire", label: "Safety / fire concerns", status: "not_mentioned" },
          { key: "price_incentives", label: "Price & incentives", status: "not_mentioned" },
          { key: "maintenance_cost", label: "Maintenance cost", status: "not_mentioned" },
        ], recommend: [],
      },
      greenwash: { risk: "low", claims: ["510 km range on a single charge", "8-year / 200,000 km battery warranty"], evidence: ["independently tested", "3,200 fast-charging stations nationwide"], note: "Claims are backed by concrete figures and testing." },
      sentiment: { reaction: "positive", note: "Concrete specs and a clear offer tend to be well received by EV-curious audiences." },
      report: "#### Verdict\nThis post has a strong chance of taking off — the channel already has a large, engaged audience and the message is clear and on-topic.\n\n#### What's working\n- A specific, credible benefit (510 km of *tested* range).\n- Concrete proof points (charging speed, station count, warranty) that build trust.\n\n#### What to improve\n- Open with a hook instead of \"New electric SUV\" — lead with the 510 km figure.\n- Soften the urgency; \"Book your free test drive\" is enough without pressure.\n- Add one price or incentive detail to answer the cost question.",
    },
  },
  {
    score: "28%",
    scoreColor: "var(--down)",
    net: "X — not-viral",
    snippet: "\"Our charging network is now available…\"",
    body: "Informative but flat, with no hook and a small audience. The tool flags a weak opening and suggests adding proof and a reason to act now.",
    full: {
      post: "Our charging network is now available nationwide.",
      scoresLine: "Audiences: YouTube 5k · X 800 · Reddit 20k  →  best on X (28%)",
      source: "x",
      prediction: {
        viral_score: 0.28, label: "not-viral", confidence: 0.44,
        top_factors: [
          { feature: "content_score", label: "Post content/topic", value: 0.4, contribution: 0.35, direction: "up" },
          { feature: "src_x", label: "Platform x", value: 1, contribution: -0.4, direction: "down" },
          { feature: "role_ratio_hook", label: "Ratio of opening hook", value: 0, contribution: -0.3, direction: "down" },
          { feature: "char_count", label: "Post length (chars)", value: 45, contribution: -0.2, direction: "down" },
        ],
        explanation_text: "Prediction: unlikely viral (probability 28%). Factors increasing it: Post content/topic. Factors decreasing it: Platform x, Ratio of opening hook, Post length.",
        suggestions: ["Open with an attention-grabbing hook.", "Add concrete numbers or proof.", "Give a reason to act now."],
      },
      barriers: {
        barriers: [
          { key: "range_anxiety", label: "Range anxiety", status: "not_mentioned" },
          { key: "charging_infrastructure", label: "Charging infrastructure", status: "addressed" },
          { key: "battery_degradation", label: "Battery degradation", status: "not_mentioned" },
          { key: "safety_fire", label: "Safety / fire concerns", status: "not_mentioned" },
          { key: "price_incentives", label: "Price & incentives", status: "not_mentioned" },
          { key: "maintenance_cost", label: "Maintenance cost", status: "not_mentioned" },
        ], recommend: [],
      },
      greenwash: { risk: "low", claims: [], evidence: [], note: "No environmental claims are made in this post." },
      sentiment: { reaction: "neutral", note: "Informative but flat — unlikely to spark strong reactions either way." },
      report: "#### Verdict\nThis post is unlikely to take off (28%). It's clear and relevant, but it reads flat for X, where posts need a strong opening to stand out.\n\n#### What's working\n- The topic is relevant to an EV-curious audience.\n\n#### What to improve\n- Open with a bold benefit or a surprising number instead of a plain statement.\n- Back it with proof: how many stations, what coverage.\n- Give a reason to act now (a link, an offer, a question).",
    },
  },
];

export default function ExampleShowcase() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? EXAMPLES[openIdx] : null;
  return (
    <>
      <div className="examples-grid">
        {EXAMPLES.map((ex, i) => (
          <div className="ex-report" key={i}>
            <div className="ex-head">
              <span className="ex-score" style={{ color: ex.scoreColor }}>{ex.score}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "17px" }}>{ex.net}</div>
                <div className="ex-net">{ex.snippet}</div>
              </div>
            </div>
            <div className="ex-body">{ex.body}</div>
            <div style={{ marginTop: "auto", paddingTop: 16, textAlign: "center" }}>
              <button className="btn-ghost" onClick={() => setOpenIdx(i)}>See the full example →</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpenIdx(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Full example analysis</span>
              <button className="modal-close" onClick={() => setOpenIdx(null)} aria-label="Close">✕</button>
            </div>
            <AnalysisDetail
              post={open.full.post}
              scoresLine={open.full.scoresLine}
              source={open.full.source}
              prediction={open.full.prediction}
              barriers={open.full.barriers}
              greenwash={open.full.greenwash}
              sentiment={open.full.sentiment}
              report={open.full.report}
            />
          </div>
        </div>
      )}
    </>
  );
}
