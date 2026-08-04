import { describe, it, expect } from "vitest";
import { translate, factorLabel } from "@/lib/i18n";

describe("translate", () => {
  it("returns the English string", () => {
    expect(translate("en", "nav.analyze")).toBe("Analyze");
  });

  it("returns the Vietnamese string", () => {
    expect(translate("vi", "nav.analyze")).toBe("Phân tích");
  });

  it("interpolates positional arguments", () => {
    expect(translate("en", "cmp.reliability", 90)).toBe("reliability 90%");
    expect(translate("en", "hist.page", 2, 5)).toBe("Page 2 of 5");
  });

  it("falls back to the key when it is unknown", () => {
    expect(translate("en", "does.not.exist")).toBe("does.not.exist");
  });
});

describe("factorLabel", () => {
  it("maps a known feature to its localized label", () => {
    expect(factorLabel("en", "content_score", "raw")).toBe("Post content/topic");
    expect(factorLabel("vi", "content_score", "raw")).toBe("Nội dung/chủ đề bài viết");
  });

  it("maps any topic feature to the content-theme label", () => {
    expect(factorLabel("en", "topic_42", "raw")).toBe("Content theme");
    expect(factorLabel("vi", "topic_42", "raw")).toBe("Chủ đề nội dung");
  });

  it("falls back to the backend label for unknown features", () => {
    expect(factorLabel("en", "some_unmapped_feature", "Backend label")).toBe("Backend label");
  });
});
