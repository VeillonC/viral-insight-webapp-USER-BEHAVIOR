"use client";

import Link from "next/link";
import { Icon } from "./components";
import ExampleShowcase from "./ExampleShowcase";
import { useT } from "@/lib/i18n";

function HeroPreview({ t }: { t: (k: string) => string }) {
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
          <div className="hp-label">{t("cmp.viralprob")}</div>
          <span className="hp-badge">{t("lbl.viral")}</span>
          <div className="hp-net">{t("hist.best.yt")}</div>
        </div>
      </div>
      <div className="hp-bars">
        <div className="hp-row"><span>{t("hp.audience")}</span><i style={{ width: "92%" }} /></div>
        <div className="hp-row"><span>{t("hp.content")}</span><i style={{ width: "62%" }} /></div>
        <div className="hp-row"><span>{t("hp.urgency")}</span><i className="amber" style={{ width: "30%" }} /></div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useT();
  return (
    <>
      <section className="hero-band">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-badge">{t("home.badge")}</span>
            <h1 className="hero-title">{t("home.title.a")}<span className="hl">{t("home.title.hl")}</span>{t("home.title.b")}</h1>
            <p className="hero-sub">{t("home.sub")}</p>
            <div className="hero-cta">
              <Link href="/analyze" className="cta-btn">{t("home.cta.primary")}</Link>
              <a href="#examples" className="cta-btn ghost">{t("home.cta.secondary")}</a>
            </div>
          </div>
          <div className="hero-art"><HeroPreview t={t} /></div>
        </div>
      </section>

      <p className="lead">
        {t("home.lead.a")}<strong>{t("home.lead.strong")}</strong>{t("home.lead.b")}
      </p>
      <div className="stat-band">
        <div className="stat"><div className="stat-num">~4,000</div><div className="stat-lbl">{t("home.stat.posts")}</div></div>
        <div className="stat"><div className="stat-num">3</div><div className="stat-lbl">{t("home.stat.networks")}</div></div>
        <div className="stat"><div className="stat-num">EN · VI</div><div className="stat-lbl">{t("home.stat.bilingual")}</div></div>
        <div className="stat"><div className="stat-num">100%</div><div className="stat-lbl">{t("home.stat.explainable")}</div></div>
      </div>

      <div className="eyebrow">{t("home.how")}</div>
      <div className="steps">
        <div className="step"><div className="step-head"><span className="ico"><Icon name="file" size={20} /></span><div className="st-title">{t("home.step1.t")}</div></div><div className="st-sub">{t("home.step1.s")}</div></div>
        <div className="step"><div className="step-head"><span className="ico"><Icon name="chart" size={20} /></span><div className="st-title">{t("home.step2.t")}</div></div><div className="st-sub">{t("home.step2.s")}</div></div>
        <div className="step"><div className="step-head"><span className="ico"><Icon name="bulb" size={20} /></span><div className="st-title">{t("home.step3.t")}</div></div><div className="st-sub">{t("home.step3.s")}</div></div>
      </div>

      <div className="eyebrow" id="examples">{t("home.examples")}</div>
      <ExampleShowcase />

      <div className="cta-band">
        <h2>{t("home.ctaband.title")}</h2>
        <p>{t("home.ctaband.sub")}</p>
        <Link href="/analyze" className="cta-btn">{t("home.cta.primary")}</Link>
      </div>
    </>
  );
}
