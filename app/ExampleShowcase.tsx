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
  net: string;
  snippet: string;
  body: string;
  full: Full;
}

const POST_A = "New electric SUV — 510 km range on a single charge, independently tested. Charge 10 to 80 percent in 18 minutes at 3,200 fast-charging stations nationwide. 8-year / 200,000 km battery warranty. Book your free test drive today.";
const POST_B = "Our charging network is now available nationwide.";

function buildExamples(lang: Lang): Example[] {
  const vi = lang === "vi";
  return [
    {
      score: "56%",
      scoreColor: "var(--accent-dark)",
      net: vi ? "YouTube — có khả năng lan truyền" : "YouTube — viral-likely",
      snippet: vi ? "\"SUV điện mới — 510 km, đã kiểm định…\"" : "\"New electric SUV — 510 km range, tested…\"",
      body: vi
        ? "Lượng khán giả kênh lớn và thông điệp rõ ràng, đúng chủ đề đẩy điểm lên; nội dung hơi kỹ thuật và dài nên kéo xuống. Không có tuyên bố môi trường nên rủi ro tẩy xanh thấp."
        : "A large, engaged channel audience and a clear, on-topic message push it up; the wording is a bit technical and long, which holds it back. No eco claims, so greenwashing risk stays low.",
      full: {
        post: POST_A,
        scoresLine: vi
          ? "Người theo dõi: YouTube 800k · X 40k · Reddit 350k → tốt nhất trên YouTube (56%)"
          : "Audiences: YouTube 800k · X 40k · Reddit 350k → best on YouTube (56%)",
        source: "youtube",
        prediction: {
          viral_score: 0.555, label: "viral-likely", confidence: 0.111,
          top_factors: [
            { feature: "chan_log_audience", label: "Channel audience size", value: 13.59, contribution: 1.59, direction: "up" },
            { feature: "content_score", label: "Post content/topic", value: 0.55, contribution: 0.41, direction: "up" },
            { feature: "char_count", label: "Post length (chars)", value: 226, contribution: -0.37, direction: "down" },
            { feature: "f_info", label: "Technical-term density", value: 0.54, contribution: -0.33, direction: "down" },
            { feature: "f_word", label: "Hard vocabulary", value: 0.65, contribution: -0.31, direction: "down" },
          ],
          explanation_text: "",
          suggestions: [],
        },
        barriers: {
          barriers: [
            { key: "range_anxiety", label: "Range anxiety", status: "addressed" },
            { key: "charging_infrastructure", label: "Charging infrastructure", status: "mentioned" },
            { key: "battery_degradation", label: "Battery degradation", status: "not_mentioned" },
            { key: "safety_fire", label: "Safety / fire concerns", status: "not_mentioned" },
            { key: "price_incentives", label: "Price & incentives", status: "not_mentioned" },
            { key: "maintenance_cost", label: "Maintenance cost", status: "not_mentioned" },
          ], recommend: [],
        },
        greenwash: {
          risk: "low", claims: [], evidence: [],
          note: vi ? "Không có tuyên bố môi trường nào." : "No environmental claims present.",
        },
        sentiment: {
          reaction: "positive",
          note: vi
            ? "Nhấn mạnh quãng đường ấn tượng và sạc nhanh — hấp dẫn với người quan tâm xe điện."
            : "Highlights impressive range and quick charging — appealing to EV-curious viewers.",
        },
        report: vi
          ? "#### Nhận định\nBài đăng này có khả năng lan truyền tốt: nội dung tập trung vào lợi ích nổi bật của sản phẩm với một thông điệp rõ ràng. Điểm yếu chính là cách diễn đạt hơi thiên về kỹ thuật.\n\n#### Điểm mạnh\n- Nhấn mạnh quãng đường tới 510 km cho một lần sạc, làm tăng sự quan tâm.\n- Thông tin cụ thể: sạc nhanh tại 3.200 trạm trên toàn quốc, tạo niềm tin vào sự tiện lợi hằng ngày.\n- Bảo hành pin đến 8 năm / 200.000 km cho thấy cam kết về chất lượng.\n\n#### Cần cải thiện\n- Giảm từ ngữ khó hiểu để nội dung dễ tiếp cận hơn.\n- Giải thích các tính năng này giúp gì cho người lái mỗi ngày.\n- Câu kêu gọi hành động mạnh mẽ hơn, vd. \"Đặt lịch lái thử ngay và trải nghiệm tương lai!\".\n\n#### Kết luận\nGiữ các luận điểm thuyết phục, nhưng làm cho thông điệp ấm áp và bớt kỹ thuật hơn."
          : "#### Verdict\nThis post has a good chance of taking off: it highlights the car's impressive range and quick charging to a large audience. The main weakness is that the wording is a bit too technical for a general audience.\n\n#### What's working\n- Highlighting key features — the 510 km range and fast charging at 3,200 stations show the EV is practical.\n- The 8-year / 200,000 km battery warranty is a strong selling point that reassures potential buyers.\n\n#### What to improve\n- Simplify the technical wording so it's easier for the average reader.\n- Explain how these features help drivers day to day (e.g. \"perfect for long trips without frequent stops\").\n- Make the call-to-action more exciting, e.g. \"Reserve your test drive now and experience the future of driving!\".\n\n#### Bottom line\nKeep the strong proof points, but make the message warmer and less technical.",
      },
    },
    {
      score: "16%",
      scoreColor: "var(--down)",
      net: vi ? "X — khó lan truyền" : "X — not-viral",
      snippet: vi ? "\"Mạng lưới sạc của chúng tôi đã có mặt…\"" : "\"Our charging network is now available…\"",
      body: vi
        ? "Rõ ràng nhưng nhạt và chung chung, thiếu câu mở đầu, không bằng chứng và lượng khán giả nhỏ — nên khó nổi bật trên mọi mạng."
        : "Clear but flat and generic, with no hook, no proof and a small audience — so it struggles to stand out on every network.",
      full: {
        post: POST_B,
        scoresLine: vi
          ? "Người theo dõi: YouTube 5k · X 800 · Reddit 20k → yếu trên mọi mạng (X 16%)"
          : "Audiences: YouTube 5k · X 800 · Reddit 20k → weak on every network (X 16%)",
        source: "x",
        prediction: {
          viral_score: 0.159, label: "not-viral", confidence: 0.683,
          top_factors: [
            { feature: "chan_log_audience", label: "Channel audience size", value: 6.69, contribution: -0.87, direction: "down" },
            { feature: "src_x", label: "Platform x", value: 1, contribution: 0.47, direction: "up" },
            { feature: "chan_has_audience", label: "Channel audience known", value: 1, contribution: -0.45, direction: "down" },
            { feature: "f_word", label: "Hard vocabulary", value: 0.95, contribution: -0.30, direction: "down" },
            { feature: "role_ratio_urgency", label: "Ratio of urgency", value: 1, contribution: -0.28, direction: "down" },
          ],
          explanation_text: "",
          suggestions: [],
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
          note: vi ? "Không có tuyên bố môi trường nào." : "No environmental claims present.",
        },
        sentiment: {
          reaction: "positive",
          note: vi
            ? "Người dùng xe điện đánh giá cao việc có thêm lựa chọn sạc."
            : "EV owners appreciate wider charging options.",
        },
        report: vi
          ? "#### Nhận định\nBài đăng này khó lan truyền. Nội dung rõ ràng nhưng chỉ là một thông báo chung chung, thiếu câu mở đầu hấp dẫn và yếu tố thúc đẩy — chưa đủ để nổi bật.\n\n#### Điểm mạnh\n- Thông điệp đơn giản, dễ hiểu: mạng sạc đã phủ toàn quốc.\n- Kênh đã có sẵn một lượng khán giả sẽ thấy bài.\n\n#### Cần cải thiện\n- Cụ thể hơn — nêu một lợi ích hoặc con số rõ ràng thay vì phát biểu chung chung.\n- Thêm câu mở đầu hoặc ưu đãi để thu hút ngay.\n- Giải thích nó thay đổi cuộc sống thế nào, vd. \"đi lại thoải mái mà không lo hết pin trên chuyến đi xa.\"\n\n#### Kết luận\nLàm bài hấp dẫn hơn bằng một lợi ích cụ thể và một lý do để hành động ngay."
          : "#### Verdict\nThis post is unlikely to take off. It's clear, but it reads as a flat, general statement with no hook or urgency — not enough to stand out.\n\n#### What's working\n- It states plainly that the charging network is available nationwide, which is easy to understand.\n- The channel has an established audience that will see the post.\n\n#### What to improve\n- Be specific — highlight a concrete benefit or number instead of a general statement (e.g. \"now over 3,000 stations nationwide\").\n- Add a hook or incentive to engage readers immediately.\n- Explain how it changes daily life, e.g. \"travel freely without worrying about running out of charge on long trips.\"\n\n#### Bottom line\nMake it more engaging by adding a specific benefit and a reason to act now.",
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
                <div style={{ fontWeight: 600, fontSize: "17px" }}>{ex.net}</div>
                <div className="ex-net">{ex.snippet}</div>
              </div>
            </div>
            <div className="ex-body">{ex.body}</div>
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
