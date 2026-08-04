import Link from "next/link";
import { Icon } from "./components";
import ExampleShowcase from "./ExampleShowcase";

function HeroArt() {
  return (
    <svg width="190" height="140" viewBox="0 0 170 120" fill="none" aria-hidden="true">
      <rect x="8" y="70" width="30" height="42" rx="5" fill="rgba(255,255,255,0.25)" />
      <rect x="48" y="46" width="30" height="66" rx="5" fill="rgba(163,230,53,0.55)" />
      <rect x="88" y="16" width="30" height="96" rx="5" fill="#a3e635" />
      <path d="M108 4 L98 20 h8 l-1 12 11-16 h-8 z" fill="#a3e635" />
      <path d="M12 62 L58 40 L100 14" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function Landing() {
  return (
    <>
      <section className="hero-band">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-badge">Explainable AI · EN / VI · trained on 600k+ posts</span>
            <h1 className="hero-title">Predict how your EV campaign will <span className="hl">land.</span></h1>
            <p className="hero-sub">Turn any social-media post into a clear campaign review — a viral score per network, the reasons behind it, and an actionable report.</p>
            <div className="hero-cta">
              <Link href="/analyze" className="cta-btn">Get my review</Link>
              <a href="#examples" className="cta-btn ghost">See example reports</a>
            </div>
          </div>
          <div className="hero-art"><HeroArt /></div>
        </div>
      </section>

      <p className="lead">
        EV campaign analyser is an AI-powered analytics platform for electric-vehicle advertising. Paste a post and it
        predicts how it would perform on YouTube, X and Reddit, explains which factors drive the score, and writes a
        marketer-friendly report in English or Vietnamese.
      </p>

      <div className="eyebrow">How it works</div>
      <div className="steps">
        <div className="step"><div className="step-head"><span className="ico"><Icon name="file" size={20} /></span><div className="st-title">Paste your post</div></div><div className="st-sub">Add the text and your audience on each network.</div></div>
        <div className="step"><div className="step-head"><span className="ico"><Icon name="chart" size={20} /></span><div className="st-title">AI compares networks</div></div><div className="st-sub">A viral score on YouTube, X and Reddit, with the factors behind it.</div></div>
        <div className="step"><div className="step-head"><span className="ico"><Icon name="bulb" size={20} /></span><div className="st-title">Get your report</div></div><div className="st-sub">Concrete, actionable tips — in English or Vietnamese.</div></div>
      </div>

      <div className="eyebrow">What you get</div>
      <div className="features">
        <div className="feature"><div className="feature-head"><span className="ico"><Icon name="up" size={20} /></span><div className="f-title">Cross-network prediction</div></div><div className="f-sub">See which platform fits your post best.</div></div>
        <div className="feature"><div className="feature-head"><span className="ico"><Icon name="bulb" size={20} /></span><div className="f-title">Explainable AI</div></div><div className="f-sub">The exact factors driving the score.</div></div>
        <div className="feature"><div className="feature-head"><span className="ico"><Icon name="shield" size={20} /></span><div className="f-title">EV-specific analysis</div></div><div className="f-sub">Tuned for electric-vehicle campaigns.</div></div>
        <div className="feature"><div className="feature-head"><span className="ico"><Icon name="file" size={20} /></span><div className="f-title">Bilingual report</div></div><div className="f-sub">Full write-up in English or Vietnamese.</div></div>
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
