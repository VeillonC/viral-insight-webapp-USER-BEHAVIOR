import Link from "next/link";
import { Icon } from "./components";

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
      <div className="examples-grid">
        <div className="ex-report">
          <div className="ex-head">
            <span className="ex-score" style={{ color: "var(--accent-dark)" }}>83%</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>YouTube — viral-likely</div>
              <div className="ex-net">&quot;New electric SUV, 510 km range — book your test drive today!&quot;</div>
            </div>
          </div>
          <div className="ex-split">
            <div><div className="ex-lbl up">Helping</div><div className="ex-tags">Channel audience · On-topic content · Clear benefit</div></div>
            <div><div className="ex-lbl down">Holding back</div><div className="ex-tags">High urgency · Reading difficulty</div></div>
          </div>
          <div className="ex-body">
            <strong>Likely viral (83%).</strong> This post is a strong fit for YouTube: the channel&apos;s large
            subscriber base and a clear, on-topic benefit (range) drive the score up. The main drag is the pushy
            &quot;today!&quot; urgency and a slightly dense phrasing.
          </div>
          <ul className="ex-tips">
            <li>Lead with the 510 km figure as a hook, not a claim.</li>
            <li>Replace &quot;today!&quot; with a softer, credible CTA.</li>
            <li>Add one proof point (independent range test).</li>
          </ul>
        </div>

        <div className="ex-report">
          <div className="ex-head">
            <span className="ex-score" style={{ color: "var(--down)" }}>28%</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>X — not-viral</div>
              <div className="ex-net">&quot;Charging network now available nationwide.&quot;</div>
            </div>
          </div>
          <div className="ex-split">
            <div><div className="ex-lbl up">Helping</div><div className="ex-tags">Relevant topic</div></div>
            <div><div className="ex-lbl down">Holding back</div><div className="ex-tags">No hook · Small audience · No proof</div></div>
          </div>
          <div className="ex-body">
            <strong>Unlikely to go viral (28%).</strong> The message is informative but reads flat for X, where posts
            need a strong opening. With a modest follower count and no concrete figures, it struggles to stand out.
          </div>
          <ul className="ex-tips">
            <li>Open with a bold benefit or a surprising number.</li>
            <li>Add proof: how many stations, what coverage.</li>
            <li>Give a reason to act now.</li>
          </ul>
        </div>
      </div>

      <div className="cta-band">
        <h2>Ready to see how your post performs?</h2>
        <p>Get an instant, explainable review across every network.</p>
        <Link href="/analyze" className="cta-btn">Get my review</Link>
      </div>
    </>
  );
}
