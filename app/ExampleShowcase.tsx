"use client";

import { useState } from "react";
import { Prediction, BarrierResponse, GreenwashResponse, SentimentResponse } from "@/lib/types";
import { AnalysisDetail } from "./components";

const EX_POST = "New electric SUV — independently tested at 510 km of range on a single charge. Charge 10–80% in 18 minutes at 3,200 fast-charging stations nationwide, with an 8-year / 200,000 km battery warranty. Book your free test drive today.";

const PREDICTION: Prediction = {
  viral_score: 0.83,
  label: "viral-likely",
  confidence: 0.66,
  top_factors: [
    { feature: "chan_log_audience", label: "Channel audience size", value: 13.6, contribution: 1.9, direction: "up" },
    { feature: "content_score", label: "Post content/topic", value: 0.6, contribution: 0.63, direction: "up" },
    { feature: "role_ratio_urgency", label: "Ratio of urgency", value: 1, contribution: -0.25, direction: "down" },
    { feature: "src_youtube", label: "Platform youtube", value: 1, contribution: -0.28, direction: "down" },
    { feature: "cognitive_friction_score", label: "Reading difficulty", value: 0.4, contribution: -0.21, direction: "down" },
  ],
  explanation_text: "Prediction: likely viral (probability 83%). Factors increasing it: Channel audience size, Post content/topic. Factors decreasing it: Platform youtube, Ratio of urgency, Reading difficulty.",
  suggestions: ["Add a clear call to action (CTA).", "Open with an attention-grabbing hook.", "Add concrete numbers or proof."],
};

const BARRIERS: BarrierResponse = {
  barriers: [
    { key: "range_anxiety", label: "Range anxiety", status: "addressed" },
    { key: "charging_infrastructure", label: "Charging infrastructure", status: "addressed" },
    { key: "battery_degradation", label: "Battery degradation", status: "mentioned" },
    { key: "safety_fire", label: "Safety / fire concerns", status: "not_mentioned" },
    { key: "price_incentives", label: "Price & incentives", status: "not_mentioned" },
    { key: "maintenance_cost", label: "Maintenance cost", status: "not_mentioned" },
  ],
  recommend: [],
};

const GREENWASH: GreenwashResponse = {
  risk: "low",
  claims: ["510 km range on a single charge", "8-year / 200,000 km battery warranty"],
  evidence: ["independently tested", "3,200 fast-charging stations nationwide"],
  note: "Claims are backed by concrete figures and testing.",
};

const SENTIMENT: SentimentResponse = {
  reaction: "positive",
  note: "Concrete specs and a clear offer tend to be well received by EV-curious audiences.",
};

const REPORT = "#### Verdict\nThis post has a strong chance of taking off — the channel already has a large, engaged audience and the message is clear and on-topic.\n\n#### What's working\n- A specific, credible benefit (510 km of *tested* range).\n- Concrete proof points (charging speed, station count, warranty) that build trust.\n\n#### What to improve\n- Open with a hook instead of \"New electric SUV\" — lead with the 510 km figure.\n- Soften the urgency; \"Book your free test drive\" is enough without pressure.\n- Add one price or incentive detail to answer the cost question.";

export default function ExampleShowcase() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="examples-grid">
        <div className="ex-report">
          <div className="ex-head">
            <span className="ex-score" style={{ color: "var(--accent-dark)" }}>83%</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>YouTube — viral-likely</div>
              <div className="ex-net">&quot;New electric SUV, 510 km range…&quot;</div>
            </div>
          </div>
          <div className="ex-body">A large channel audience and strong, on-topic content drive it up, while high urgency holds it back. Backed by concrete proof, so greenwashing risk stays low.</div>
          <button className="btn-ghost" style={{ marginTop: 14 }} onClick={() => setOpen(true)}>See the full example →</button>
        </div>
        <div className="ex-report">
          <div className="ex-head">
            <span className="ex-score" style={{ color: "var(--down)" }}>28%</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>X — not-viral</div>
              <div className="ex-net">&quot;Charging network now available…&quot;</div>
            </div>
          </div>
          <div className="ex-body">Informative but flat, with no hook and a small audience. The tool flags a weak opening and suggests adding proof and a reason to act now.</div>
          <button className="btn-ghost" style={{ marginTop: 14 }} onClick={() => setOpen(true)}>See the full example →</button>
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Full example analysis</span>
              <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <AnalysisDetail
              post={EX_POST}
              scoresLine="Best network: YouTube 83% · X 51% · Reddit 44%"
              source="youtube"
              prediction={PREDICTION}
              barriers={BARRIERS}
              greenwash={GREENWASH}
              sentiment={SENTIMENT}
              report={REPORT}
            />
          </div>
        </div>
      )}
    </>
  );
}
