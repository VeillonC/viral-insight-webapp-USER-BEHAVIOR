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
      <div className="card">
        <table className="perf-table">
          <thead>
            <tr><th>Platform</th><th>ROC-AUC</th><th>Reliability</th></tr>
          </thead>
          <tbody>
            <tr><td>YouTube</td><td>0.92</td><td>High</td></tr>
            <tr><td>Reddit</td><td>0.76</td><td>Good</td></tr>
            <tr><td>X</td><td>0.72</td><td>Fair — small sample</td></tr>
            <tr><td><strong>Overall</strong></td><td><strong>0.84</strong></td><td>—</td></tr>
          </tbody>
        </table>
        <p className="help" style={{ marginTop: 12 }}>ROC-AUC on the held-out test set. X has the fewest examples, so its predictions are the least reliable.</p>
      </div>

      <div className="eyebrow">AI &amp; Big Data pipeline</div>
      <div className="pipeline">
        {["Crawlers", "Kafka", "Spark streaming", "Iceberg lakehouse", "ML model", "Web app"].map((s, i, arr) => (
          <span key={s} className="pipe-node">{s}{i < arr.length - 1 && <span className="pipe-arrow">→</span>}</span>
        ))}
      </div>
      <p className="help" style={{ marginTop: 10 }}>Posts are collected, streamed, cleaned and stored in a lakehouse, then used to train the model that powers this app.</p>
    </>
  );
}
