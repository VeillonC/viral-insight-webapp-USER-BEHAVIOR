import Link from "next/link";
import { Icon } from "./components";
import ExampleShowcase from "./ExampleShowcase";

function HeroPreview() {
  const C = 2 * Math.PI * 34;
  const off = C * (1 - 0.83);
  return (
    <div className="hero-preview">
      <div className="hp-top">
        <svg width="82" height="82" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#e6f4ea" strokeWidth="8" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="#15803d" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 40 40)" />
          <text x="40" y="47" textAnchor="middle" fontSize="19" fontWeight="700" fill="#0f5f2e" fontFamily="var(--font-head)">83%</text>
        </svg>
        <div>
          <div className="hp-label">Viral probability</div>
          <span className="hp-badge">viral-likely</span>
          <div className="hp-net">Best on YouTube</div>
        </div>
      </div>
      <div className="hp-bars">
        <div className="hp-row"><span>Channel audience</span><i style={{ width: "92%" }} /></div>
        <div className="hp-row"><span>Post content</span><i style={{ width: "62%" }} /></div>
        <div className="hp-row"><span>Urgency</span><i className="amber" style={{ width: "30%" }} /></div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <>
      <section className="hero-band">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-badge">Explainable AI · EN / VI · trained on 600k+ posts</span>
            <h1 className="hero-title">Will your EV ad <span className="hl">go viral?</span> Find out before you post.</h1>
            <p className="hero-sub">Paste your post and get an instant, explainable review — a viral score for YouTube, X and Reddit, why it&apos;ll work, and how to make it better.</p>
            <div className="hero-cta">
              <Link href="/analyze" className="cta-btn">Get my review</Link>
              <a href="#examples" className="cta-btn ghost">See example reports</a>
            </div>
          </div>
          <div className="hero-art"><HeroPreview /></div>
        </div>
      </section>

      <p className="lead">
        The AI analytics platform for <strong>electric-vehicle advertising</strong> — predict, explain and improve your
        posts before you publish.
      </p>
      <div className="stat-band">
        <div className="stat"><div className="stat-num">600k+</div><div className="stat-lbl">posts analyzed</div></div>
        <div className="stat"><div className="stat-num">3</div><div className="stat-lbl">networks compared</div></div>
        <div className="stat"><div className="stat-num">EN · VI</div><div className="stat-lbl">bilingual reports</div></div>
        <div className="stat"><div className="stat-num">100%</div><div className="stat-lbl">explainable AI</div></div>
      </div>

      <div className="eyebrow">How it works</div>
      <div className="steps">
        <div className="step"><div className="step-head"><span className="ico"><Icon name="file" size={20} /></span><div className="st-title">Paste your post</div></div><div className="st-sub">Add the text and your audience on each network.</div></div>
        <div className="step"><div className="step-head"><span className="ico"><Icon name="chart" size={20} /></span><div className="st-title">AI compares networks</div></div><div className="st-sub">A viral score on YouTube, X and Reddit, with the factors behind it.</div></div>
        <div className="step"><div className="step-head"><span className="ico"><Icon name="bulb" size={20} /></span><div className="st-title">Get your report</div></div><div className="st-sub">Concrete, actionable tips — in English or Vietnamese.</div></div>
      </div>

      <div className="eyebrow" id="examples">Example reports</div>
      <ExampleShowcase />

      <div className="cta-band">
        <h2>Ready to see how your post performs?</h2>
        <p>Get an instant, explainable review across every network.</p>
        <Link href="/analyze" className="cta-btn">Get my review</Link>
      </div>
    </>
  );
}
