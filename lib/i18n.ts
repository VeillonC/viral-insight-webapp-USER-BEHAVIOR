"use client";

import { useLang } from "@/app/LangContext";
import { Lang } from "@/lib/types";

// Central UI dictionary. Every user-facing static string lives here in EN + VI.
// Generated content (LLM reports, model suggestions) is localised by the backend
// via the `lang` parameter; the maps below cover the fixed vocabulary the
// front-end renders itself (barrier names, statuses, risk/reaction labels, etc.).

type Dict = Record<string, string>;

const en: Dict = {
  // ---- Nav / chrome ----
  "nav.analyze": "Analyze",
  "nav.variant": "Variant lab",
  "nav.history": "History",
  "nav.insights": "Insights",
  "footer.tagline": "EV campaign analyser — AI & Big Data for sustainable marketing",
  "footer.insights": "Insights",
  "footer.github": "GitHub",

  // ---- Landing ----
  "home.badge": "Explainable AI · EN / VI · trained on ~4,000 posts",
  "home.title.a": "Will your EV ad ",
  "home.title.hl": "go viral?",
  "home.title.b": " Find out before you post.",
  "home.sub": "Paste your post and get an instant, explainable review — a viral score for YouTube, X and Reddit, why it'll work, and how to make it better.",
  "home.cta.primary": "Get my review",
  "home.cta.secondary": "See example reports",
  "home.lead.a": "The AI analytics platform for ",
  "home.lead.strong": "electric-vehicle advertising",
  "home.lead.b": " — predict, explain and improve your posts before you publish.",
  "home.stat.posts": "posts analyzed",
  "home.stat.networks": "networks compared",
  "home.stat.bilingual": "bilingual reports",
  "home.stat.explainable": "explainable AI",
  "home.how": "How it works",
  "home.step1.t": "Paste your post",
  "home.step1.s": "Add the text and your audience on each network.",
  "home.step2.t": "AI compares networks",
  "home.step2.s": "A viral score on YouTube, X and Reddit, with the factors behind it.",
  "home.step3.t": "Get your report",
  "home.step3.s": "Concrete, actionable tips — in English or Vietnamese.",
  "hp.audience": "Channel audience",
  "hp.content": "Post content",
  "hp.urgency": "Urgency",
  "home.examples": "Example reports",
  "home.ctaband.title": "Ready to see how your post performs?",
  "home.ctaband.sub": "Get an instant, explainable review across every network.",

  // ---- Analyze ----
  "an.title": "Get your EV campaign review",
  "an.cue.a": "Paste your post and your audience per network — we compare YouTube, X and Reddit, explain the score and write an actionable report. ",
  "an.cue.strong": "Fill in the fields below to start.",
  "an.campaign": "Campaign name",
  "an.campaign.ph": "e.g. Q2 EV SUV launch",
  "an.campaign.help": "Give this analysis a name to find it easily in your History.",
  "an.post": "Post",
  "an.post.ph": "e.g. New electric SUV, 510 km range on a single charge — book your test drive today!",
  "an.try": "Try an example:",
  "an.addtmpl": "Add a template:",
  "an.aud": "Your audience per network",
  "an.optional": "(optional)",
  "an.aud.yt": "YouTube subscribers",
  "an.aud.x": "X followers",
  "an.aud.rd": "Reddit members",
  "an.model": "Model",
  "an.analyze": "Analyze",
  "an.analyzing": "Analyzing…",
  "an.preview.lbl": "Analyzing",
  "an.preview.tags": "comparing YouTube, X and Reddit · model: {0} · report in {1}",
  "an.details": "Details — {0}",
  "an.err": "Something went wrong.",

  // ---- Examples (analyze chips) ----
  "ex.range": "Range claim",
  "ex.charging": "Charging network",
  "ex.price": "Price + incentive",
  "ex.range.txt": "Our new electric SUV delivers 510 km of range on a single charge — book your test drive today!",
  "ex.charging.txt": "Worried about charging? Over 3,000 fast-charging stations are now available nationwide.",
  "ex.price.txt": "Going electric has never been cheaper — government incentives cut up to $7,500 off this month.",

  // ---- Components: network / gauge / meta ----
  "cmp.pernet": "How it performs per network",
  "cmp.best": "Best",
  "cmp.reliability": "reliability {0}%",
  "cmp.clicknet": "Click a network to see its full breakdown below.",
  "cmp.viralprob": "Viral probability",
  "cmp.confidence": "Confidence",
  "cmp.conf.sub": "distance from the 0.5 threshold",
  "cmp.platrel": "Platform reliability",
  "cmp.rel.on": "ROC-AUC on {0}",
  "cmp.rel.overall": "overall ROC-AUC",
  "cmp.rel.weak": " · low, interpret with caution",
  "cmp.summary": "Summary",
  "cmp.helping": "What's helping",
  "cmp.holding": "What's holding it back",
  "cmp.why": "Why — what drives the score",
  "cmp.tag.strong": "strong",
  "cmp.tag.medium": "medium",
  "cmp.tag.minor": "minor",
  "cmp.tag.hurts": "hurts",
  "cmp.leg.up": "pushes viral",
  "cmp.leg.down": "holds it back",
  "cmp.leg.hint": "Longer bar = bigger impact",
  "cmp.suggestions": "Suggestions",
  "cmp.contenttheme": "Content theme",

  // ---- Barriers ----
  "bar.title": "EV barrier radar",
  "bar.loading": "Checking the six EV-adoption barriers…",
  "bar.err": "Barrier analysis couldn't run: {0}",
  "bar.focus": "To improve this post, address:",
  "bar.status.addressed": "Addressed",
  "bar.status.mentioned": "Mentioned",
  "bar.status.not_mentioned": "Not mentioned",
  "bar.key.range_anxiety": "Range anxiety",
  "bar.key.charging_infrastructure": "Charging infrastructure",
  "bar.key.battery_degradation": "Battery degradation",
  "bar.key.safety_fire": "Safety / fire concerns",
  "bar.key.price_incentives": "Price & incentives",
  "bar.key.maintenance_cost": "Maintenance cost",

  // ---- Greenwashing ----
  "gw.title": "Greenwashing risk",
  "gw.loading": "Checking claims vs evidence…",
  "gw.err": "Greenwashing check couldn't run: {0}",
  "gw.claims": "Green claims ({0})",
  "gw.evidence": "Supporting evidence ({0})",
  "gw.none": "None detected.",
  "gw.risk.low": "Low risk",
  "gw.risk.medium": "Medium risk",
  "gw.risk.high": "High risk",

  // ---- Sentiment ----
  "se.title": "Likely audience reaction",
  "se.loading": "Predicting how the audience would react…",
  "se.err": "Reaction analysis couldn't run: {0}",
  "se.positive": "Positive",
  "se.neutral": "Neutral",
  "se.skeptical": "Skeptical",
  "se.hostile": "Hostile",

  // ---- Report ----
  "rep.title": "AI report",
  "rep.loading": "Writing the report…",
  "rep.err": "Report couldn't be generated: {0}",
  "rep.translate": "Translate this report to English",
  "detail.analyzedpost": "Analyzed post",

  // ---- History ----
  "hist.title": "History",
  "hist.subtitle": "Your past analyses, saved on this device. Search, filter, sort and export.",
  "hist.empty": "No analyses yet. Run one from the Analyze page and it'll appear here.",
  "hist.search": "Search name or text…",
  "hist.all": "All networks",
  "hist.best.yt": "Best on YouTube",
  "hist.best.x": "Best on X",
  "hist.best.rd": "Best on Reddit",
  "hist.sort.new": "Sort: newest",
  "hist.sort.score": "Sort: highest score",
  "hist.export": "Export CSV",
  "hist.clear": "Clear all",
  "hist.confirm": "Delete all saved analyses?",
  "hist.trend": "Score trend",
  "hist.trend.sub": "Best-network viral score across your {0} analyses (oldest → newest).",
  "hist.best": "Best:",
  "hist.viewfull": "view full analysis",
  "hist.delete": "delete",
  "hist.prev": "← Previous",
  "hist.next": "Next →",
  "hist.page": "Page {0} of {1}",
  "hist.analysis": "Analysis",
  "hist.scoresline": "YouTube {0} · X {1} · Reddit {2} · Best: {3} · Model: {4}",

  // ---- Variant lab ----
  "vl.title": "Variant lab",
  "vl.cue": "Write several versions of a post and compare their viral score on the same platform — pick the strongest before publishing.",
  "vl.platform": "Platform",
  "vl.aud": "Audience (optional)",
  "vl.variant": "Variant {0}",
  "vl.remove": "remove",
  "vl.variant.ph": "Write a version of your post…",
  "vl.add": "+ Add variant",
  "vl.compare": "Compare variants",
  "vl.comparing": "Comparing…",
  "vl.need2": "Add at least two non-empty variants to compare.",
  "vl.ranking": "Ranking",
  "vl.err": "Something went wrong.",

  // ---- Insights ----
  "in.title": "Sustainability insights",
  "in.subtitle": "The AI and Big Data foundation behind the tool. (Static overview for now — live figures coming later.)",
  "in.dataset": "Dataset",
  "in.corpus": "Training set",
  "in.corpus.sub": "labelled posts (current model)",
  "in.yt.sub": "videos + comments",
  "in.rd.sub": "posts + comments",
  "in.x.sub": "posts",
  "model.fusion-v1.blurb": "Content, audience, marketing roles and topics combined (XGBoost). Balanced default across networks.",
  "in.modelperf": "Model performance",
  "in.platform": "Platform",
  "in.overall": "Overall",
  "in.note1": "ROC-AUC on the held-out test set. X has the fewest examples, so its predictions are the least reliable. More models can be added and compared here as they are trained.",
  "in.note2": "Posts are collected, streamed, cleaned and stored in a lakehouse, then used to train the model that powers this app.",

  // ---- Example showcase (homepage cards + modal) ----
  "sc.viewfull": "See the full example →",
  "sc.fulltitle": "Full example analysis",
  "sc.close": "Close",
  "sc.ex1.net": "YouTube — viral-likely",
  "sc.ex1.snippet": "\"New electric SUV — 510 km range…\"",
  "sc.ex1.body": "A large channel audience and strong, on-topic content drive it up, while high urgency holds it back. Backed by concrete proof, so greenwashing risk stays low.",
  "sc.ex2.net": "X — not-viral",
  "sc.ex2.snippet": "\"Our charging network is now available…\"",
  "sc.ex2.body": "Informative but flat, with no hook and a small audience. The tool flags a weak opening and suggests adding proof and a reason to act now.",

  // ---- Labels shared ----
  "lbl.viral": "viral-likely",
  "lbl.notviral": "not-viral",

  // ---- 404 ----
  "nf.title": "Page not found",
  "nf.sub": "The page you're looking for doesn't exist or has moved.",
  "nf.home": "Back to home",

  // ---- Error boundary ----
  "err.title": "Something went wrong",
  "err.sub": "An unexpected error occurred. Please try again.",
  "err.retry": "Try again",
  "err.home": "Back to home",

  // ---- Glossary tooltips ----
  "gloss.probability": "Estimated chance the post goes viral, from the model (0-100%).",
  "gloss.confidence": "How sure the model is about its call — based on how far the score is from the 0.5 threshold.",
  "gloss.threshold": "Decision line: at or above 0.5 the post is labelled viral-likely, below it not-viral.",
  "gloss.reliability": "How well the model performs on this platform (ROC-AUC on the test set). Lower = take the result with a pinch of salt.",
  "gloss.factors": "The features that pushed the score up (green) or down (amber), ranked by impact (SHAP).",
  "gloss.audience": "Follower / subscriber count of the account posting. Bigger audience usually means more reach.",
  "gloss.barriers": "The six common reasons people hesitate to buy an EV. A strong post addresses the most relevant ones.",
  "gloss.greenwashing": "Risk the post is seen as making vague or exaggerated eco claims without concrete evidence.",
  "gloss.reaction": "How the audience is likely to respond to the post — from positive to hostile.",

  // ---- Templates ----
  "tmpl.proof.role": "Proof",
  "tmpl.proof.text": "Tested: 510 km per charge under mixed urban/highway conditions.",
  "tmpl.objection.role": "Objection handling",
  "tmpl.objection.text": "Worried about charging? More than 3,000 charging stations are available nationwide.",
  "tmpl.social.role": "Social proof",
  "tmpl.social.text": "Over 25,000 customers have already switched to electric vehicles this year.",
  "tmpl.hook.role": "Hook",
  "tmpl.hook.text": "Still paying for petrol every week? Here's what switching to electric really changes.",
  "tmpl.cta.role": "Call to action",
  "tmpl.cta.text": "Book a free test drive this week and feel the difference yourself.",
};

const vi: Dict = {
  // ---- Nav / chrome ----
  "nav.analyze": "Phân tích",
  "nav.variant": "Phòng thử biến thể",
  "nav.history": "Lịch sử",
  "nav.insights": "Thông tin",
  "footer.tagline": "EV campaign analyser — AI & Dữ liệu lớn cho marketing bền vững",
  "footer.insights": "Thông tin",
  "footer.github": "GitHub",

  // ---- Landing ----
  "home.badge": "AI giải thích được · EN / VI · huấn luyện trên ~4.000 bài",
  "home.title.a": "Quảng cáo xe điện của bạn ",
  "home.title.hl": "sẽ lan truyền?",
  "home.title.b": " Biết trước khi đăng.",
  "home.sub": "Dán bài viết của bạn và nhận đánh giá tức thì, có giải thích — điểm lan truyền cho YouTube, X và Reddit, lý do hiệu quả, và cách cải thiện.",
  "home.cta.primary": "Nhận đánh giá",
  "home.cta.secondary": "Xem báo cáo mẫu",
  "home.lead.a": "Nền tảng phân tích AI cho ",
  "home.lead.strong": "quảng cáo xe điện",
  "home.lead.b": " — dự đoán, giải thích và cải thiện bài viết trước khi đăng.",
  "home.stat.posts": "bài đã phân tích",
  "home.stat.networks": "mạng được so sánh",
  "home.stat.bilingual": "báo cáo song ngữ",
  "home.stat.explainable": "AI giải thích được",
  "home.how": "Cách hoạt động",
  "home.step1.t": "Dán bài viết",
  "home.step1.s": "Thêm nội dung và lượng người theo dõi trên mỗi mạng.",
  "home.step2.t": "AI so sánh các mạng",
  "home.step2.s": "Điểm lan truyền trên YouTube, X và Reddit, kèm các yếu tố đứng sau.",
  "home.step3.t": "Nhận báo cáo",
  "home.step3.s": "Gợi ý cụ thể, có thể hành động — bằng tiếng Anh hoặc tiếng Việt.",
  "hp.audience": "Người theo dõi kênh",
  "hp.content": "Nội dung bài",
  "hp.urgency": "Tính khẩn cấp",
  "home.examples": "Báo cáo mẫu",
  "home.ctaband.title": "Sẵn sàng xem bài của bạn thể hiện ra sao?",
  "home.ctaband.sub": "Nhận đánh giá tức thì, có giải thích trên mọi mạng.",

  // ---- Analyze ----
  "an.title": "Nhận đánh giá chiến dịch xe điện",
  "an.cue.a": "Dán bài viết và lượng người theo dõi từng mạng — chúng tôi so sánh YouTube, X và Reddit, giải thích điểm số và viết báo cáo hữu ích. ",
  "an.cue.strong": "Điền các trường bên dưới để bắt đầu.",
  "an.campaign": "Tên chiến dịch",
  "an.campaign.ph": "vd. Ra mắt SUV điện Q2",
  "an.campaign.help": "Đặt tên cho phân tích này để dễ tìm trong Lịch sử.",
  "an.post": "Bài viết",
  "an.post.ph": "vd. SUV điện mới, quãng đường 510 km cho một lần sạc — đặt lịch lái thử ngay!",
  "an.try": "Thử một ví dụ:",
  "an.addtmpl": "Thêm mẫu:",
  "an.aud": "Người theo dõi của bạn theo mạng",
  "an.optional": "(tùy chọn)",
  "an.aud.yt": "Người đăng ký YouTube",
  "an.aud.x": "Người theo dõi X",
  "an.aud.rd": "Thành viên Reddit",
  "an.model": "Mô hình",
  "an.analyze": "Phân tích",
  "an.analyzing": "Đang phân tích…",
  "an.preview.lbl": "Đang phân tích",
  "an.preview.tags": "so sánh YouTube, X và Reddit · mô hình: {0} · báo cáo bằng {1}",
  "an.details": "Chi tiết — {0}",
  "an.err": "Đã xảy ra lỗi.",

  // ---- Examples (analyze chips) ----
  "ex.range": "Tuyên bố quãng đường",
  "ex.charging": "Mạng lưới sạc",
  "ex.price": "Giá + ưu đãi",
  "ex.range.txt": "SUV điện mới của chúng tôi đạt 510 km cho một lần sạc — đặt lịch lái thử ngay!",
  "ex.charging.txt": "Lo lắng về việc sạc? Hơn 3.000 trạm sạc nhanh đã có mặt trên toàn quốc.",
  "ex.price.txt": "Chuyển sang xe điện chưa bao giờ rẻ đến thế — ưu đãi chính phủ giảm tới 7.500$ trong tháng này.",

  // ---- Components: network / gauge / meta ----
  "cmp.pernet": "Hiệu quả theo từng mạng",
  "cmp.best": "Tốt nhất",
  "cmp.reliability": "độ tin cậy {0}%",
  "cmp.clicknet": "Nhấp vào một mạng để xem phân tích đầy đủ bên dưới.",
  "cmp.viralprob": "Xác suất lan truyền",
  "cmp.confidence": "Độ tự tin",
  "cmp.conf.sub": "khoảng cách so với ngưỡng 0.5",
  "cmp.platrel": "Độ tin cậy nền tảng",
  "cmp.rel.on": "ROC-AUC trên {0}",
  "cmp.rel.overall": "ROC-AUC tổng thể",
  "cmp.rel.weak": " · thấp, cần thận trọng khi diễn giải",
  "cmp.summary": "Tóm tắt",
  "cmp.helping": "Điều đang hỗ trợ",
  "cmp.holding": "Điều đang cản trở",
  "cmp.why": "Vì sao — điều gì quyết định điểm số",
  "cmp.tag.strong": "mạnh",
  "cmp.tag.medium": "trung bình",
  "cmp.tag.minor": "nhẹ",
  "cmp.tag.hurts": "gây hại",
  "cmp.leg.up": "đẩy lan truyền",
  "cmp.leg.down": "cản trở",
  "cmp.leg.hint": "Thanh dài hơn = tác động lớn hơn",
  "cmp.suggestions": "Gợi ý",
  "cmp.contenttheme": "Chủ đề nội dung",

  // ---- Barriers ----
  "bar.title": "Radar rào cản xe điện",
  "bar.loading": "Đang kiểm tra sáu rào cản chấp nhận xe điện…",
  "bar.err": "Không chạy được phân tích rào cản: {0}",
  "bar.focus": "Để cải thiện bài này, hãy giải quyết:",
  "bar.status.addressed": "Đã giải quyết",
  "bar.status.mentioned": "Có nhắc đến",
  "bar.status.not_mentioned": "Chưa nhắc đến",
  "bar.key.range_anxiety": "Lo ngại quãng đường",
  "bar.key.charging_infrastructure": "Hạ tầng sạc",
  "bar.key.battery_degradation": "Chai pin",
  "bar.key.safety_fire": "An toàn / cháy nổ",
  "bar.key.price_incentives": "Giá & ưu đãi",
  "bar.key.maintenance_cost": "Chi phí bảo trì",

  // ---- Greenwashing ----
  "gw.title": "Rủi ro tẩy xanh",
  "gw.loading": "Đang đối chiếu tuyên bố với bằng chứng…",
  "gw.err": "Không chạy được kiểm tra tẩy xanh: {0}",
  "gw.claims": "Tuyên bố xanh ({0})",
  "gw.evidence": "Bằng chứng hỗ trợ ({0})",
  "gw.none": "Không phát hiện.",
  "gw.risk.low": "Rủi ro thấp",
  "gw.risk.medium": "Rủi ro trung bình",
  "gw.risk.high": "Rủi ro cao",

  // ---- Sentiment ----
  "se.title": "Phản ứng khán giả dự kiến",
  "se.loading": "Đang dự đoán phản ứng của khán giả…",
  "se.err": "Không chạy được phân tích phản ứng: {0}",
  "se.positive": "Tích cực",
  "se.neutral": "Trung lập",
  "se.skeptical": "Hoài nghi",
  "se.hostile": "Thù địch",

  // ---- Report ----
  "rep.title": "Báo cáo AI",
  "rep.loading": "Đang viết báo cáo…",
  "rep.err": "Không tạo được báo cáo: {0}",
  "rep.translate": "Dịch báo cáo này sang tiếng Việt",
  "detail.analyzedpost": "Bài đã phân tích",

  // ---- History ----
  "hist.title": "Lịch sử",
  "hist.subtitle": "Các phân tích trước của bạn, lưu trên thiết bị này. Tìm kiếm, lọc, sắp xếp và xuất.",
  "hist.empty": "Chưa có phân tích nào. Chạy một phân tích từ trang Phân tích và nó sẽ hiện ở đây.",
  "hist.search": "Tìm theo tên hoặc nội dung…",
  "hist.all": "Tất cả các mạng",
  "hist.best.yt": "Tốt nhất trên YouTube",
  "hist.best.x": "Tốt nhất trên X",
  "hist.best.rd": "Tốt nhất trên Reddit",
  "hist.sort.new": "Sắp xếp: mới nhất",
  "hist.sort.score": "Sắp xếp: điểm cao nhất",
  "hist.export": "Xuất CSV",
  "hist.clear": "Xóa tất cả",
  "hist.confirm": "Xóa toàn bộ phân tích đã lưu?",
  "hist.trend": "Xu hướng điểm số",
  "hist.trend.sub": "Điểm lan truyền của mạng tốt nhất qua {0} phân tích (cũ nhất → mới nhất).",
  "hist.best": "Tốt nhất:",
  "hist.viewfull": "xem phân tích đầy đủ",
  "hist.delete": "xóa",
  "hist.prev": "← Trước",
  "hist.next": "Sau →",
  "hist.page": "Trang {0}/{1}",
  "hist.analysis": "Phân tích",
  "hist.scoresline": "YouTube {0} · X {1} · Reddit {2} · Tốt nhất: {3} · Mô hình: {4}",

  // ---- Variant lab ----
  "vl.title": "Phòng thử biến thể",
  "vl.cue": "Viết nhiều phiên bản của một bài và so sánh điểm lan truyền trên cùng nền tảng — chọn phiên bản mạnh nhất trước khi đăng.",
  "vl.platform": "Nền tảng",
  "vl.aud": "Người theo dõi (tùy chọn)",
  "vl.variant": "Biến thể {0}",
  "vl.remove": "xóa",
  "vl.variant.ph": "Viết một phiên bản bài của bạn…",
  "vl.add": "+ Thêm biến thể",
  "vl.compare": "So sánh biến thể",
  "vl.comparing": "Đang so sánh…",
  "vl.need2": "Thêm ít nhất hai biến thể có nội dung để so sánh.",
  "vl.ranking": "Xếp hạng",
  "vl.err": "Đã xảy ra lỗi.",

  // ---- Insights ----
  "in.title": "Thông tin bền vững",
  "in.subtitle": "Nền tảng AI và Dữ liệu lớn phía sau công cụ. (Tổng quan tĩnh hiện tại — số liệu trực tiếp sẽ có sau.)",
  "in.dataset": "Tập dữ liệu",
  "in.corpus": "Tập huấn luyện",
  "in.corpus.sub": "bài đã gán nhãn (mô hình hiện tại)",
  "in.yt.sub": "video + bình luận",
  "in.rd.sub": "bài + bình luận",
  "in.x.sub": "bài",
  "model.fusion-v1.blurb": "Kết hợp nội dung, người theo dõi, vai trò marketing và chủ đề (XGBoost). Mặc định cân bằng trên các mạng.",
  "in.modelperf": "Hiệu năng mô hình",
  "in.platform": "Nền tảng",
  "in.overall": "Tổng thể",
  "in.note1": "ROC-AUC trên tập kiểm tra tách riêng. X có ít mẫu nhất nên dự đoán kém tin cậy nhất. Có thể thêm và so sánh nhiều mô hình ở đây khi chúng được huấn luyện.",
  "in.note2": "Bài viết được thu thập, truyền phát, làm sạch và lưu trong lakehouse, rồi dùng để huấn luyện mô hình vận hành ứng dụng này.",

  // ---- Example showcase ----
  "sc.viewfull": "Xem ví dụ đầy đủ →",
  "sc.fulltitle": "Phân tích ví dụ đầy đủ",
  "sc.close": "Đóng",
  "sc.ex1.net": "YouTube — có khả năng lan truyền",
  "sc.ex1.snippet": "\"SUV điện mới — quãng đường 510 km…\"",
  "sc.ex1.body": "Lượng người theo dõi kênh lớn và nội dung mạnh, đúng chủ đề đẩy điểm lên, trong khi tính khẩn cấp cao kéo xuống. Có bằng chứng cụ thể nên rủi ro tẩy xanh thấp.",
  "sc.ex2.net": "X — khó lan truyền",
  "sc.ex2.snippet": "\"Mạng lưới sạc của chúng tôi đã có mặt…\"",
  "sc.ex2.body": "Nhiều thông tin nhưng nhạt, thiếu câu mở đầu hấp dẫn và lượng theo dõi nhỏ. Công cụ chỉ ra phần mở đầu yếu và gợi ý thêm bằng chứng cùng lý do hành động ngay.",

  // ---- Labels shared ----
  "lbl.viral": "có khả năng lan truyền",
  "lbl.notviral": "khó lan truyền",

  // ---- 404 ----
  "nf.title": "Không tìm thấy trang",
  "nf.sub": "Trang bạn tìm không tồn tại hoặc đã được di chuyển.",
  "nf.home": "Về trang chủ",

  // ---- Error boundary ----
  "err.title": "Đã xảy ra sự cố",
  "err.sub": "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
  "err.retry": "Thử lại",
  "err.home": "Về trang chủ",

  // ---- Glossary tooltips ----
  "gloss.probability": "Khả năng ước tính bài viết lan truyền, theo mô hình (0-100%).",
  "gloss.confidence": "Mức độ chắc chắn của mô hình — dựa trên khoảng cách của điểm số so với ngưỡng 0.5.",
  "gloss.threshold": "Ngưỡng quyết định: từ 0.5 trở lên bài được gắn nhãn có khả năng lan truyền, dưới mức đó là khó lan truyền.",
  "gloss.reliability": "Mô hình hoạt động tốt ra sao trên nền tảng này (ROC-AUC trên tập kiểm tra). Thấp hơn = hãy dè dặt với kết quả.",
  "gloss.factors": "Các đặc trưng đẩy điểm lên (xanh lá) hoặc xuống (hổ phách), xếp theo mức tác động (SHAP).",
  "gloss.audience": "Số người theo dõi / đăng ký của tài khoản đăng bài. Lượng theo dõi lớn hơn thường có độ phủ cao hơn.",
  "gloss.barriers": "Sáu lý do phổ biến khiến người ta ngần ngại mua xe điện. Một bài mạnh sẽ giải quyết những rào cản liên quan nhất.",
  "gloss.greenwashing": "Rủi ro bài viết bị coi là đưa ra tuyên bố môi trường mơ hồ hoặc phóng đại mà không có bằng chứng cụ thể.",
  "gloss.reaction": "Khán giả có khả năng phản hồi thế nào với bài — từ tích cực đến thù địch.",

  // ---- Templates ----
  "tmpl.proof.role": "Bằng chứng",
  "tmpl.proof.text": "Đã kiểm nghiệm: 510 km mỗi lần sạc trong điều kiện hỗn hợp đô thị/cao tốc.",
  "tmpl.objection.role": "Xử lý phản đối",
  "tmpl.objection.text": "Lo về việc sạc? Có hơn 3.000 trạm sạc trên toàn quốc.",
  "tmpl.social.role": "Bằng chứng xã hội",
  "tmpl.social.text": "Hơn 25.000 khách hàng đã chuyển sang xe điện trong năm nay.",
  "tmpl.hook.role": "Câu mở đầu",
  "tmpl.hook.text": "Vẫn đổ xăng mỗi tuần? Đây là điều thực sự thay đổi khi chuyển sang xe điện.",
  "tmpl.cta.role": "Kêu gọi hành động",
  "tmpl.cta.text": "Đặt lịch lái thử miễn phí tuần này và tự cảm nhận sự khác biệt.",
};

const DICTS: Record<Lang, Dict> = { en, vi };

export type TFunc = (key: string, ...args: (string | number)[]) => string;

export function translate(lang: Lang, key: string, ...args: (string | number)[]): string {
  let s = DICTS[lang][key] ?? en[key] ?? key;
  args.forEach((a, i) => { s = s.replace(`{${i}}`, String(a)); });
  return s;
}

export function useT(): { t: TFunc; lang: Lang } {
  const { lang } = useLang();
  const t: TFunc = (key, ...args) => translate(lang, key, ...args);
  return { t, lang };
}

// Localised label for a prediction factor. Known model features are mapped;
// otherwise the backend-provided label is used as a fallback.
const FACTOR_KEYS: Record<string, string> = {
  chan_log_audience: "fac.audience",
  content_score: "fac.content",
  role_ratio_urgency: "fac.urgency",
  role_ratio_hook: "fac.hook",
  cognitive_friction_score: "fac.reading",
  char_count: "fac.length",
  f_info: "fac.techdensity",
  f_word: "fac.hardvocab",
  chan_has_audience: "fac.audknown",
  src_youtube: "fac.plat_youtube",
  src_x: "fac.plat_x",
  src_reddit: "fac.plat_reddit",
};
const FAC_EN: Dict = {
  "fac.audience": "Channel audience size",
  "fac.content": "Post content/topic",
  "fac.urgency": "Ratio of urgency",
  "fac.hook": "Ratio of opening hook",
  "fac.reading": "Reading difficulty",
  "fac.length": "Post length (chars)",
  "fac.techdensity": "Technical-term density",
  "fac.hardvocab": "Hard vocabulary",
  "fac.audknown": "Channel audience known",
  "fac.plat_youtube": "Platform YouTube",
  "fac.plat_x": "Platform X",
  "fac.plat_reddit": "Platform Reddit",
};
const FAC_VI: Dict = {
  "fac.audience": "Quy mô người theo dõi kênh",
  "fac.content": "Nội dung/chủ đề bài viết",
  "fac.urgency": "Tỷ lệ tính khẩn cấp",
  "fac.hook": "Tỷ lệ câu mở đầu",
  "fac.reading": "Độ khó đọc",
  "fac.length": "Độ dài bài (ký tự)",
  "fac.techdensity": "Mật độ thuật ngữ kỹ thuật",
  "fac.hardvocab": "Từ ngữ khó",
  "fac.audknown": "Đã biết lượng khán giả",
  "fac.plat_youtube": "Nền tảng YouTube",
  "fac.plat_x": "Nền tảng X",
  "fac.plat_reddit": "Nền tảng Reddit",
};
export function factorLabel(lang: Lang, feature: string, fallback: string): string {
  if (feature.startsWith("topic")) return translate(lang, "cmp.contenttheme");
  const k = FACTOR_KEYS[feature];
  if (k) return (lang === "vi" ? FAC_VI : FAC_EN)[k] ?? fallback;
  return fallback;
}
