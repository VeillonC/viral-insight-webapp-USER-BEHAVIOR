"use client";

import { MODELS } from "@/lib/config";
import { useT } from "@/lib/i18n";

const MODEL_DETAILS = {
  "fusion-v1": {
    number: "01",
    badgeKey: "in.badge.default",
    rows: 3990,
    sourceCounts: { youtube: 1978, reddit: 1341, x: 671 },
    datasetKey: "in.fusion.dataset",
    audienceKey: "in.fusion.audience",
    validationKey: "in.fusion.validation",
    featureCount: null,
  },
  "audience-x90": {
    number: "02",
    badgeKey: "in.badge.audience",
    rows: 58020,
    sourceCounts: { youtube: 19340, reddit: 19340, x: 19340 },
    datasetKey: "in.x90.dataset",
    audienceKey: "in.x90.audience",
    validationKey: "in.x90.validation",
    featureCount: 52,
  },
} as const;

const SOURCES = ["youtube", "reddit", "x"] as const;
const FEATURE_KEYS = ["content", "language", "roles", "topics", "context", "audience"] as const;

export default function Insights() {
  const { t, lang } = useT();
  const formatNumber = (value: number) => new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US").format(value);

  return (
    <>
      <div className="insights-hero">
        <div>
          <div className="insights-kicker">{t("in.kicker")}</div>
          <h1 className="page-title">{t("in.title")}</h1>
          <p className="page-subtitle">{t("in.subtitle")}</p>
        </div>
        <div className="insights-hero-stat" aria-label={t("in.models.available") }>
          <strong>{MODELS.length}</strong>
          <span>{t("in.models.available")}</span>
        </div>
      </div>

      <div className="insights-snapshot" aria-label={t("in.snapshot") }>
        <div><strong>14.5×</strong><span>{t("in.snapshot.scale")}</span></div>
        <div><strong>EN + VI</strong><span>{t("in.snapshot.languages")}</span></div>
        <div><strong>3</strong><span>{t("in.snapshot.platforms")}</span></div>
        <div><strong>5-fold</strong><span>{t("in.snapshot.validation")}</span></div>
      </div>

      <div className="eyebrow">{t("in.modelcatalog")}</div>
      <div className="model-catalog">
        {MODELS.map((model) => {
          const details = MODEL_DETAILS[model.id as keyof typeof MODEL_DETAILS];
          if (!details) return null;
          const largestSource = Math.max(...Object.values(details.sourceCounts));

          return (
            <article className={`model-profile ${model.id === "audience-x90" ? "model-profile-featured" : ""}`} key={model.id}>
              <header className="model-profile-head">
                <div className="model-number" aria-hidden="true">{details.number}</div>
                <div className="model-profile-title">
                  <div className="model-title-line">
                    <h2>{model.name}</h2>
                    <span className="model-status">{t(details.badgeKey)}</span>
                  </div>
                  <p>{t(`model.${model.id}.blurb`)}</p>
                </div>
                <div className="model-overall">
                  <span>{t("in.overall.roc")}</span>
                  <strong>{model.reliability[""].toFixed(3)}</strong>
                </div>
              </header>

              <div className="model-profile-grid">
                <section className="model-panel">
                  <div className="model-panel-label">{t("in.dataset")}</div>
                  <div className="dataset-total">
                    <strong>{formatNumber(details.rows)}</strong>
                    <span>{t("in.labelled.posts")}</span>
                  </div>
                  <p className="model-panel-copy">{t(details.datasetKey)}</p>

                  <div className="source-distribution">
                    {SOURCES.map((source) => {
                      const count = details.sourceCounts[source];
                      return (
                        <div className="source-row" key={source}>
                          <div className="source-row-label"><span>{source === "youtube" ? "YouTube" : source === "reddit" ? "Reddit" : "X"}</span><strong>{formatNumber(count)}</strong></div>
                          <div className="source-track"><span style={{ width: `${(count / largestSource) * 100}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="model-panel">
                  <div className="model-panel-label">{t("in.features")}</div>
                  <div className="feature-count">
                    <strong>{details.featureCount ?? t("in.multisignal")}</strong>
                    <span>{details.featureCount ? t("in.engineered.features") : t("in.feature.families")}</span>
                  </div>
                  <div className="model-feature-list">
                    {FEATURE_KEYS.map((feature) => (
                      <span className={feature === "audience" && model.id === "audience-x90" ? "feature-highlight" : ""} key={feature}>
                        {t(`in.feature.${feature}`)}
                      </span>
                    ))}
                  </div>
                  <div className="audience-note">
                    <span aria-hidden="true">◎</span>
                    <p><strong>{t("in.audience.coverage")}</strong>{t(details.audienceKey)}</p>
                  </div>
                </section>
              </div>

              <div className="model-bottom-grid">
                <section>
                  <div className="model-panel-label">{t("in.modelperf")}</div>
                  <div className="performance-bars">
                    {SOURCES.map((source) => {
                      const score = model.reliability[source];
                      return (
                        <div className="performance-row" key={source}>
                          <span>{source === "youtube" ? "YouTube" : source === "reddit" ? "Reddit" : "X"}</span>
                          <div className="performance-track"><i style={{ width: `${score * 100}%` }} /></div>
                          <strong>{score.toFixed(3)}</strong>
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section className="validation-card">
                  <div className="model-panel-label">{t("in.validation")}</div>
                  <p>{t(details.validationKey)}</p>
                  <span>{t("in.validation.caption")}</span>
                </section>
              </div>
            </article>
          );
        })}
      </div>

      <div className="model-method-note">
        <strong>{t("in.reading.title")}</strong>
        <p>{t("in.reading.note")}</p>
      </div>
    </>
  );
}
