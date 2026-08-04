import { MODELS } from "@/lib/config";

export default function Insights() {
  return (
    <>
      <h1 className="page-title">Sustainability insights</h1>
      <p className="page-subtitle">The AI and Big Data foundation behind the tool. (Static overview for now — live figures coming later.)</p>

      <div className="eyebrow">Dataset</div>
      <div className="metrics">
        <div className="metric"><div className="label">Total corpus</div><div className="value">~745k</div><div className="sub">cleaned social-media events</div></div>
        <div className="metric"><div className="label">YouTube</div><div className="value">621k</div><div className="sub">videos + comments</div></div>
        <div className="metric"><div className="label">Reddit</div><div className="value">108k</div><div className="sub">posts + comments</div></div>
        <div className="metric"><div className="label">X</div><div className="value">16.5k</div><div className="sub">posts (still growing)</div></div>
      </div>

      <div className="eyebrow">Model performance</div>
      {MODELS.map((m) => (
        <div className="card" key={m.id} style={{ marginBottom: "1.25rem" }}>
          <div className="section-title">{m.name}</div>
          <p className="help" style={{ marginTop: 0, marginBottom: 12 }}>{m.blurb}</p>
          <table className="perf-table">
            <thead><tr><th>Platform</th><th>ROC-AUC</th></tr></thead>
            <tbody>
              <tr><td>YouTube</td><td>{m.reliability.youtube}</td></tr>
              <tr><td>Reddit</td><td>{m.reliability.reddit}</td></tr>
              <tr><td>X</td><td>{m.reliability.x}</td></tr>
              <tr><td><strong>Overall</strong></td><td><strong>{m.reliability[""]}</strong></td></tr>
            </tbody>
          </table>
        </div>
      ))}
      <p className="help">ROC-AUC on the held-out test set. X has the fewest examples, so its predictions are the least reliable. More models can be added and compared here as they are trained.</p>

      <p className="help" style={{ marginTop: 16 }}>Posts are collected, streamed, cleaned and stored in a lakehouse, then used to train the model that powers this app.</p>
    </>
  );
}
