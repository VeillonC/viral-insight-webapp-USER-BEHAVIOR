"use client";

import { MODELS } from "@/lib/config";
import { useT } from "@/lib/i18n";

export default function Insights() {
  const { t } = useT();
  return (
    <>
      <h1 className="page-title">{t("in.title")}</h1>
      <p className="page-subtitle">{t("in.subtitle")}</p>

      <div className="eyebrow">{t("in.dataset")}</div>
      <div className="metrics">
        <div className="metric"><div className="label">{t("in.corpus")}</div><div className="value">~745k</div><div className="sub">{t("in.corpus.sub")}</div></div>
        <div className="metric"><div className="label">YouTube</div><div className="value">621k</div><div className="sub">{t("in.yt.sub")}</div></div>
        <div className="metric"><div className="label">Reddit</div><div className="value">108k</div><div className="sub">{t("in.rd.sub")}</div></div>
        <div className="metric"><div className="label">X</div><div className="value">16.5k</div><div className="sub">{t("in.x.sub")}</div></div>
      </div>

      <div className="eyebrow">{t("in.modelperf")}</div>
      {MODELS.map((m) => (
        <div className="card" key={m.id} style={{ marginBottom: "1.25rem" }}>
          <div className="section-title">{m.name}</div>
          <p className="help" style={{ marginTop: 0, marginBottom: 12 }}>{t(`model.${m.id}.blurb`)}</p>
          <table className="perf-table">
            <thead><tr><th>{t("in.platform")}</th><th>ROC-AUC</th></tr></thead>
            <tbody>
              <tr><td>YouTube</td><td>{m.reliability.youtube}</td></tr>
              <tr><td>Reddit</td><td>{m.reliability.reddit}</td></tr>
              <tr><td>X</td><td>{m.reliability.x}</td></tr>
              <tr><td><strong>{t("in.overall")}</strong></td><td><strong>{m.reliability[""]}</strong></td></tr>
            </tbody>
          </table>
        </div>
      ))}
      <p className="help">{t("in.note1")}</p>

      <p className="help" style={{ marginTop: 16 }}>{t("in.note2")}</p>
    </>
  );
}
