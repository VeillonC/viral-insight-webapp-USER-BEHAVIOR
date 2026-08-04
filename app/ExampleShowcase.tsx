"use client";

import { useState } from "react";
import { Prediction, BarrierResponse, GreenwashResponse, SentimentResponse, Source, Lang } from "@/lib/types";
import { AnalysisDetail } from "./components";
import { useT } from "@/lib/i18n";

interface Full {
  post: string;
  scoresLine: string;
  source: Source;
  prediction: Prediction;
  barriers: BarrierResponse;
  greenwash: GreenwashResponse;
  sentiment: SentimentResponse;
  report: string;
}
interface Example {
  score: string;
  scoreColor: string;
  netKey: string;
  snippetKey: string;
  bodyKey: string;
  full: Full;
}

function buildExamples(lang: Lang): Example[] {
  const vi = lang === "vi";
  return [
    {
      score: "83%",
      scoreColor: "var(--accent-dark)",
      netKey: "sc.ex1.net",
      snippetKey: "sc.ex1.snippet",
      bodyKey: "sc.ex1.body",
      full: {
        post: vi
          ? "SUV điện mới — được kiểm nghiệm độc lập đạt 510 km cho một lần sạc. Sạc 10–80% trong 18 phút tại 3.200 trạm sạc nhanh toàn quốc, kèm bảo hành pin 8 năm / 200.000 km. Đặt lịch lái thử miễn phí ngay hôm nay."
          : "New electric SUV — independently tested at 510 km of range on a single charge. Charge 10–80% in 18 minutes at 3,200 fast-charging stations nationwide, with an 8-year / 200,000 km battery warranty. Book your free test drive today.",
        scoresLine: vi
          ? "Người theo dõi: YouTube 800k · X 40k · Reddit 350k  →  tốt nhất trên YouTube (83%)"
          : "Audiences: YouTube 800k · X 40k · Reddit 350k  →  best on YouTube (83%)",
        source: "youtube",
        prediction: {
          viral_score: 0.83, label: "viral-likely", confidence: 0.66,
          top_factors: [
            { feature: "chan_log_audience", label: "Channel audience size", value: 13.6, contribution: 1.9, direction: "up" },
            { feature: "content_score", label: "Post content/topic", value: 0.6, contribution: 0.63, direction: "up" },
            { feature: "role_ratio_urgency", label: "Ratio of urgency", value: 1, contribution: -0.25, direction: "down" },
            { feature: "src_youtube", label: "Platform youtube", value: 1, contribution: -0.28, direction: "down" },
            { feature: "cognitive_friction_score", label: "Reading difficulty", value: 0.4, contribution: -0.21, direction: "down" },
          ],
          explanation_text: "",
          suggestions: vi
            ? ["Thêm lời kêu gọi hành động rõ ràng (CTA).", "Mở đầu bằng câu hook thu hút.", "Thêm con số hoặc bằng chứng cụ thể."]
            : ["Add a clear call to action (CTA).", "Open with an attention-grabbing hook.", "Add concrete numbers or proof."],
        },
        barriers: {
          barriers: [
            { key: "range_anxiety", label: "Range anxiety", status: "addressed" },
            { key: "charging_infrastructure", label: "Charging infrastructure", status: "addressed" },
            { key: "battery_degradation", label: "Battery degradation", status: "mentioned" },
            { key: "safety_fire", label: "Safety / fire concerns", status: "not_mentioned" },
            { key: "price_incentives", label: "Price & incentives", status: "not_mentioned" },
            { key: "maintenance_cost", label: "Maintenance cost", status: "not_mentioned" },
          ], recommend: [],
        },
        greenwash: {
          risk: "low",
          claims: vi
            ? ["510 km cho một lần sạc", "bảo hành pin 8 năm / 200.000 km"]
            : ["510 km range on a single charge", "8-year / 200,000 km battery warranty"],
          evidence: vi
            ? ["được kiểm nghiệm độc lập", "3.200 trạm sạc nhanh toàn quốc"]
            : ["independently tested", "3,200 fast-charging stations nationwide"],
          note: vi
            ? "Các tuyên bố được hỗ trợ bằng số liệu cụ thể và kiểm nghiệm."
            : "Claims are backed by concrete figures and testing.",
        },
        sentiment: {
          reaction: "positive",
          note: vi
            ? "Thông số cụ thể và ưu đãi rõ ràng thường được khán giả quan tâm xe điện đón nhận tốt."
            : "Concrete specs and a clear offer tend to be well received by EV-curious audiences.",
        },
        report: vi
          ? "#### Kết luận\nBài này có khả năng cao lan truyền — kênh đã có lượng khán giả lớn, tương tác tốt và thông điệp rõ ràng, đúng chủ đề.\n\n#### Điểm mạnh\n- Lợi ích cụ thể, đáng tin (510 km quãng đường *đã kiểm nghiệm*).\n- Bằng chứng cụ thể (tốc độ sạc, số trạm, bảo hành) tạo dựng niềm tin.\n\n#### Cần cải thiện\n- Mở đầu bằng câu hook thay vì \"SUV điện mới\" — dẫn dắt bằng con số 510 km.\n- Giảm tính khẩn cấp; \"Đặt lịch lái thử miễn phí\" là đủ.\n- Thêm một chi tiết về giá hoặc ưu đãi để trả lời câu hỏi chi phí."
          : "#### Verdict\nThis post has a strong chance of taking off — the channel already has a large, engaged audience and the message is clear and on-topic.\n\n#### What's working\n- A specific, credible benefit (510 km of *tested* range).\n- Concrete proof points (charging speed, station count, warranty) that build trust.\n\n#### What to improve\n- Open with a hook instead of \"New electric SUV\" — lead with the 510 km figure.\n- Soften the urgency; \"Book your free test drive\" is enough without pressure.\n- Add one price or incentive detail to answer the cost question.",
      },
    },
    {
      score: "28%",
      scoreColor: "var(--down)",
      netKey: "sc.ex2.net",
      snippetKey: "sc.ex2.snippet",
      bodyKey: "sc.ex2.body",
      full: {
        post: vi ? "Mạng lưới sạc của chúng tôi nay đã có mặt trên toàn quốc." : "Our charging network is now available nationwide.",
        scoresLine: vi
          ? "Người theo dõi: YouTube 5k · X 800 · Reddit 20k  →  tốt nhất trên X (28%)"
          : "Audiences: YouTube 5k · X 800 · Reddit 20k  →  best on X (28%)",
        source: "x",
        prediction: {
          viral_score: 0.28, label: "not-viral", confidence: 0.44,
          top_factors: [
            { feature: "content_score", label: "Post content/topic", value: 0.4, contribution: 0.35, direction: "up" },
            { feature: "src_x", label: "Platform x", value: 1, contribution: -0.4, direction: "down" },
            { feature: "role_ratio_hook", label: "Ratio of opening hook", value: 0, contribution: -0.3, direction: "down" },
            { feature: "char_count", label: "Post length (chars)", value: 45, contribution: -0.2, direction: "down" },
          ],
          explanation_text: "",
          suggestions: vi
            ? ["Mở đầu bằng câu hook thu hút.", "Thêm con số hoặc bằng chứng cụ thể.", "Cho một lý do để hành động ngay."]
            : ["Open with an attention-grabbing hook.", "Add concrete numbers or proof.", "Give a reason to act now."],
        },
        barriers: {
          barriers: [
            { key: "range_anxiety", label: "Range anxiety", status: "not_mentioned" },
            { key: "charging_infrastructure", label: "Charging infrastructure", status: "addressed" },
            { key: "battery_degradation", label: "Battery degradation", status: "not_mentioned" },
            { key: "safety_fire", label: "Safety / fire concerns", status: "not_mentioned" },
            { key: "price_incentives", label: "Price & incentives", status: "not_mentioned" },
            { key: "maintenance_cost", label: "Maintenance cost", status: "not_mentioned" },
          ], recommend: [],
        },
        greenwash: {
          risk: "low", claims: [], evidence: [],
          note: vi ? "Bài viết không đưa ra tuyên bố môi trường nào." : "No environmental claims are made in this post.",
        },
        sentiment: {
          reaction: "neutral",
          note: vi
            ? "Nhiều thông tin nhưng nhạt — khó tạo phản ứng mạnh theo hướng nào."
            : "Informative but flat — unlikely to spark strong reactions either way.",
        },
        report: vi
          ? "#### Kết luận\nBài này khó lan truyền (28%). Nội dung rõ ràng và liên quan, nhưng đọc khá nhạt với X, nơi bài cần mở đầu mạnh để nổi bật.\n\n#### Điểm mạnh\n- Chủ đề liên quan tới khán giả quan tâm xe điện.\n\n#### Cần cải thiện\n- Mở đầu bằng lợi ích nổi bật hoặc con số bất ngờ thay vì một câu phát biểu bình thường.\n- Bổ sung bằng chứng: bao nhiêu trạm, độ phủ ra sao.\n- Cho một lý do hành động ngay (một liên kết, một ưu đãi, một câu hỏi)."
          : "#### Verdict\nThis post is unlikely to take off (28%). It's clear and relevant, but it reads flat for X, where posts need a strong opening to stand out.\n\n#### What's working\n- The topic is relevant to an EV-curious audience.\n\n#### What to improve\n- Open with a bold benefit or a surprising number instead of a plain statement.\n- Back it with proof: how many stations, what coverage.\n- Give a reason to act now (a link, an offer, a question).",
      },
    },
  ];
}

export default function ExampleShowcase() {
  const { t, lang } = useT();
  const examples = buildExamples(lang);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? examples[openIdx] : null;
  return (
    <>
      <div className="examples-grid">
        {examples.map((ex, i) => (
          <div className="ex-report" key={i}>
            <div className="ex-head">
              <span className="ex-score" style={{ color: ex.scoreColor }}>{ex.score}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "17px" }}>{t(ex.netKey)}</div>
                <div className="ex-net">{t(ex.snippetKey)}</div>
              </div>
            </div>
            <div className="ex-body">{t(ex.bodyKey)}</div>
            <div style={{ marginTop: "auto", paddingTop: 16, textAlign: "center" }}>
              <button className="btn-ghost" onClick={() => setOpenIdx(i)}>{t("sc.viewfull")}</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpenIdx(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">{t("sc.fulltitle")}</span>
              <button className="modal-close" onClick={() => setOpenIdx(null)} aria-label={t("sc.close")}>✕</button>
            </div>
            <AnalysisDetail
              post={open.full.post}
              scoresLine={open.full.scoresLine}
              source={open.full.source}
              prediction={open.full.prediction}
              barriers={open.full.barriers}
              greenwash={open.full.greenwash}
              sentiment={open.full.sentiment}
              report={open.full.report}
            />
          </div>
        </div>
      )}
    </>
  );
}
