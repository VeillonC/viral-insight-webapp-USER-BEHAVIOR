"use client";

import { useEffect, useRef, useState } from "react";
import { predict, getReport, getBarriers, getGreenwashing, getSentiment } from "@/lib/api";
import { Prediction, Source, Lang, BarrierResponse, GreenwashResponse, SentimentResponse, PredictionModel } from "@/lib/types";
import { MODELS, DEFAULT_MODEL_ID, modelApiId, modelName } from "@/lib/config";
import { addHistory, consumeAnalysisDraft, updateHistory } from "@/lib/history";
import { useLang } from "../LangContext";
import { useT } from "@/lib/i18n";
import { InfoTip, NET_NAMES, NetworkCompare, ScoreGauge, MetaGrid, SummaryBox, FactorBars, ReportPanel, BarrierRadar, GreenwashCard, SentimentCard } from "../components";

interface NetResult { source: Source; audience: number | null; prediction: Prediction; }
interface AnalysisRequest {
  historyId: string;
  title: string;
  text: string;
  model: string;
  apiModel: PredictionModel;
  audiences: Record<Source, number | null>;
  lang: Lang;
}
interface QueueToast { id: number; title: string; message: string; }
const NETWORKS: Source[] = ["youtube", "x", "reddit"];

const EXAMPLE_KEYS = [
  { label: "ex.range", text: "ex.range.txt" },
  { label: "ex.charging", text: "ex.charging.txt" },
  { label: "ex.price", text: "ex.price.txt" },
];
const TEMPLATE_KEYS = [
  { role: "tmpl.proof.role", text: "tmpl.proof.text" },
  { role: "tmpl.objection.role", text: "tmpl.objection.text" },
  { role: "tmpl.social.role", text: "tmpl.social.text" },
  { role: "tmpl.hook.role", text: "tmpl.hook.text" },
  { role: "tmpl.cta.role", text: "tmpl.cta.text" },
];

export default function Analyze() {
  const { lang } = useLang();
  const { t } = useT();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL_ID);
  const [audYt, setAudYt] = useState("");
  const [audX, setAudX] = useState("");
  const [audRd, setAudRd] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const [analyzedText, setAnalyzedText] = useState<string | null>(null);
  const [analyzedModel, setAnalyzedModel] = useState(DEFAULT_MODEL_ID);
  const [results, setResults] = useState<NetResult[]>([]);
  const [selected, setSelected] = useState<Source>("youtube");
  const [report, setReport] = useState<string | null>(null);
  const [reportLang, setReportLang] = useState<Lang | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAiPipeline, setLoadingAiPipeline] = useState(false);
  const [queuedAnalyses, setQueuedAnalyses] = useState(0);
  const [queueToasts, setQueueToasts] = useState<QueueToast[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [barriers, setBarriers] = useState<BarrierResponse | null>(null);
  const [loadingBarriers, setLoadingBarriers] = useState(false);
  const [barriersError, setBarriersError] = useState<string | null>(null);
  const [greenwash, setGreenwash] = useState<GreenwashResponse | null>(null);
  const [loadingGreenwash, setLoadingGreenwash] = useState(false);
  const [greenwashError, setGreenwashError] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [sentimentError, setSentimentError] = useState<string | null>(null);
  const histId = useRef<string | null>(null);
  const aiPipelineBusyRef = useRef(false);
  const pendingAnalysesRef = useRef<AnalysisRequest[]>([]);
  const toastIdRef = useRef(0);
  const toastTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const draft = consumeAnalysisDraft();
    if (!draft) return;
    setTitle(draft.title ?? "");
    setText(draft.text);
    if (draft.model) setModel(draft.model);
    if (draft.audiences) {
      setAudYt(draft.audiences.youtube == null ? "" : String(draft.audiences.youtube));
      setAudX(draft.audiences.x == null ? "" : String(draft.audiences.x));
      setAudRd(draft.audiences.reddit == null ? "" : String(draft.audiences.reddit));
    }
  }, []);

  useEffect(() => () => toastTimersRef.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = taRef.current;
    if (el) { el.style.height = "auto"; el.style.height = `${Math.max(el.scrollHeight, 280)}px`; }
  }, [text]);

  const parseAud = (raw: string) => (raw.trim() ? Number(raw.replace(/[^0-9.]/g, "")) : null);
  const audMap = (): Record<Source, number | null> => ({ youtube: parseAud(audYt), x: parseAud(audX), reddit: parseAud(audRd), "": null });

  function showQueueToast(titleText: string, message: string) {
    const id = ++toastIdRef.current;
    setQueueToasts((items) => [...items, { id, title: titleText, message }]);
    toastTimersRef.current.push(setTimeout(() => {
      setQueueToasts((items) => items.filter((item) => item.id !== id));
    }, 5_000));
    return id;
  }

  function updateQueueToast(id: number, titleText: string, message: string) {
    setQueueToasts((items) => items.map((item) => (
      item.id === id ? { ...item, title: titleText, message } : item
    )));
  }

  async function fetchReport(txt: string, s: Source, audience: number | null, l: Lang, apiModel: PredictionModel) {
    setLoadingReport(true);
    setReportProgress(t("rep.submitting"));
    setReportError(null);
    const toastId = showQueueToast(t("queue.report.title"), t("queue.report.submitting"));
    try {
      const res = await getReport(txt, s, audience, l, apiModel, (job) => {
        setReportProgress(job.status === "queued" ? t("rep.queued", job.position ?? 1) : t("rep.running"));
        updateQueueToast(
          toastId,
          t("queue.report.title"),
          job.status === "queued"
            ? t("queue.report.message", job.position ?? 1)
            : t("queue.report.running"),
        );
      });
      setReport(res.report);
      setReportLang(l);
      if (histId.current) updateHistory(histId.current, { report: res.report });
    } catch (e) {
      setReport(null);
      setReportError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setLoadingReport(false);
      setReportProgress(null);
    }
  }

  async function fetchBarriers(txt: string) {
    setLoadingBarriers(true);
    setBarriersError(null);
    try {
      const b = await getBarriers(txt);
      setBarriers(b);
      if (histId.current) updateHistory(histId.current, { barriers: b });
    } catch (e) {
      setBarriers(null);
      setBarriersError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setLoadingBarriers(false);
    }
  }

  async function fetchGreenwash(txt: string, reportLanguage: Lang) {
    setLoadingGreenwash(true);
    setGreenwashError(null);
    try {
      const g = await getGreenwashing(txt, reportLanguage);
      setGreenwash(g);
      if (histId.current) updateHistory(histId.current, { greenwash: g });
    } catch (e) {
      setGreenwash(null);
      setGreenwashError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setLoadingGreenwash(false);
    }
  }

  async function fetchSentiment(txt: string, reportLanguage: Lang) {
    setLoadingSentiment(true);
    setSentimentError(null);
    try {
      const s = await getSentiment(txt, reportLanguage);
      setSentiment(s);
      if (histId.current) updateHistory(histId.current, { sentiment: s });
    } catch (e) {
      setSentiment(null);
      setSentimentError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setLoadingSentiment(false);
    }
  }

  async function runAnalysis(request: AnalysisRequest) {
    aiPipelineBusyRef.current = true;
    setLoadingAiPipeline(true);
    histId.current = request.historyId;
    updateHistory(request.historyId, { status: "running", error: undefined });
    setAnalyzedText(request.text);
    setAnalyzedModel(request.model);
    setResults([]);
    setReport(null);
    setError(null);
    setReportError(null);
    setBarriers(null);
    setBarriersError(null);
    setGreenwash(null);
    setGreenwashError(null);
    setSentiment(null);
    setSentimentError(null);
    setLoading(true);
    try {
      // Sequential calls: Tailscale Funnel (free tier) and the CPU can't handle
      // many requests at once — parallel calls return 502. One at a time.
      const preds: Prediction[] = [];
      for (const s of NETWORKS) preds.push(await predict(request.text, s, request.audiences[s], request.apiModel));
      const res: NetResult[] = NETWORKS.map((s, i) => ({ source: s, audience: request.audiences[s], prediction: preds[i] }));
      setResults(res);
      const best = res.reduce((a, b) => (b.prediction.viral_score > a.prediction.viral_score ? b : a));
      setSelected(best.source);
      setLoading(false);
      updateHistory(request.historyId, {
        source: best.source,
        scores: {
          youtube: res.find((r) => r.source === "youtube")?.prediction.viral_score,
          x: res.find((r) => r.source === "x")?.prediction.viral_score,
          reddit: res.find((r) => r.source === "reddit")?.prediction.viral_score,
        },
        best: { source: best.source, score: best.prediction.viral_score, label: best.prediction.label },
        prediction: best.prediction,
      });
      // Run the LLM analyses one after another (avoids 502s through the Funnel
      // and CPU contention). Fast 3B cards first, then the slower 7B report.
      await fetchBarriers(request.text);
      await fetchGreenwash(request.text, request.lang);
      await fetchSentiment(request.text, request.lang);
      await fetchReport(request.text, best.source, best.audience, request.lang, request.apiModel);
      updateHistory(request.historyId, { status: "completed" });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("an.err");
      setError(message);
      updateHistory(request.historyId, { status: "failed", error: message });
      setLoading(false);
    } finally {
      const next = pendingAnalysesRef.current.shift();
      setQueuedAnalyses(pendingAnalysesRef.current.length);
      if (next) {
        void runAnalysis(next);
      } else {
        aiPipelineBusyRef.current = false;
        setLoadingAiPipeline(false);
      }
    }
  }

  function onAnalyze() {
    const historyId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());
    const audiences = audMap();
    const willQueue = aiPipelineBusyRef.current;
    const request: AnalysisRequest = {
      historyId,
      title,
      text,
      model,
      apiModel: modelApiId(model),
      audiences,
      lang,
    };
    addHistory({
      id: historyId,
      ts: Date.now(),
      status: willQueue ? "pending" : "running",
      title: title.trim() || undefined,
      text,
      model,
      audiences: { youtube: audiences.youtube, x: audiences.x, reddit: audiences.reddit },
    });
    if (willQueue) {
      pendingAnalysesRef.current.push(request);
      setQueuedAnalyses(pendingAnalysesRef.current.length);
      showQueueToast(t("queue.analysis.title"), t("queue.analysis.message", pendingAnalysesRef.current.length));
      return;
    }
    void runAnalysis(request);
  }

  function addTemplate(txt: string) {
    setText((prev) => (prev.trim() ? `${prev.trim()} ${txt}` : txt));
  }

  function selectNetwork(s: Source) {
    if (aiPipelineBusyRef.current) return;
    setSelected(s);
    const r = results.find((x) => x.source === s);
    if (r && analyzedText) fetchReport(analyzedText, s, r.audience, lang, r.prediction.model ?? modelApiId(analyzedModel));
  }

  const sel = results.find((r) => r.source === selected);

  return (
    <>
      <div className="queue-toast-stack" aria-live="polite">
        {queueToasts.map((toast) => (
          <div className="queue-toast" key={toast.id} role="status">
            <div className="queue-toast-icon" aria-hidden="true">↻</div>
            <div><strong>{toast.title}</strong><span>{toast.message}</span></div>
          </div>
        ))}
      </div>
      <h1 className="page-title">{t("an.title")}</h1>
      <p className="input-cue">{t("an.cue.a")}<strong>{t("an.cue.strong")}</strong></p>

      <div className="card">
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="title">{t("an.campaign")}</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("an.campaign.ph")} />
          <div className="help">{t("an.campaign.help")}</div>
        </div>
        <div className="input-grid">
          <div>
            <label htmlFor="post">{t("an.post")}</label>
            <textarea ref={taRef} id="post" value={text} onChange={(e) => setText(e.target.value)}
              placeholder={t("an.post.ph")} />
            <div className="examples">
              {t("an.try")}
              {EXAMPLE_KEYS.map((ex) => (
                <button key={ex.label} className="example-chip" onClick={() => setText(t(ex.text))}>{t(ex.label)}</button>
              ))}
            </div>
            <div className="templates">
              {t("an.addtmpl")}
              {TEMPLATE_KEYS.map((tm) => (
                <button key={tm.role} className="tmpl-chip" onClick={() => addTemplate(t(tm.text))} title={t(tm.text)}>+ {t(tm.role)}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="aud-label">{t("an.aud")} <InfoTip term="audience" /> <span className="muted">{t("an.optional")}</span></div>
            <div className="aud-stack">
              <div><label>{t("an.aud.yt")}</label><input value={audYt} onChange={(e) => setAudYt(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 50000" inputMode="numeric" pattern="[0-9]*" /></div>
              <div><label>{t("an.aud.x")}</label><input value={audX} onChange={(e) => setAudX(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 12000" inputMode="numeric" pattern="[0-9]*" /></div>
              <div><label>{t("an.aud.rd")}</label><input value={audRd} onChange={(e) => setAudRd(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 340000" inputMode="numeric" pattern="[0-9]*" /></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label htmlFor="model">{t("an.model")}</label>
              <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
                {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <div className="help">{t(`model.${model}.blurb`)}</div>
            </div>
            <button className="btn btn-block" onClick={onAnalyze} disabled={loading || !text.trim()}>
              {loading ? t("an.analyzing") : loadingAiPipeline ? t("an.queue.add") : t("an.analyze")}
            </button>
            {loadingAiPipeline && (
              <div className="analysis-queue-status" role="status">
                <span className="spinner" />
                {queuedAnalyses > 0 ? t("an.queue.pending", queuedAnalyses) : t("an.queue.running")}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error" style={{ marginTop: "1.25rem" }}>{error}</div>}

      {analyzedText && !error && (
        <div className="preview" style={{ marginTop: "1.25rem" }}>
          <div className="lbl">{t("an.preview.lbl")}</div>
          <div className="txt">{analyzedText}</div>
          <div className="tags">{t("an.preview.tags", modelName(analyzedModel), lang.toUpperCase())}</div>
        </div>
      )}

      {results.length > 0 && (
        <>
          <NetworkCompare results={results} selected={selected} onSelect={selectNetwork} />
          {sel && (
            <>
              <div className="eyebrow">{t("an.details", NET_NAMES[selected])}</div>
              <div className="metrics">
                <ScoreGauge prediction={sel.prediction} />
                <MetaGrid prediction={sel.prediction} source={selected} />
              </div>
              <SummaryBox factors={sel.prediction.top_factors} />
              <div className="cols">
                <BarrierRadar data={barriers} loading={loadingBarriers} error={barriersError} />
                <GreenwashCard data={greenwash} loading={loadingGreenwash} error={greenwashError} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <SentimentCard data={sentiment} loading={loadingSentiment} error={sentimentError} />
              </div>
              <div className="stack">
                <FactorBars factors={sel.prediction.top_factors} />
                <ReportPanel
                  report={report}
                  loading={loadingReport}
                  loadingLabel={reportProgress}
                  error={reportError}
                  onTranslate={reportLang && reportLang !== lang && sel && analyzedText ? () => fetchReport(analyzedText, selected, sel.audience, lang, sel.prediction.model ?? modelApiId(analyzedModel)) : undefined}
                  translateLabel={t("rep.translate")}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
