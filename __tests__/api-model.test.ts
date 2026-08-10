import { afterEach, describe, expect, it, vi } from "vitest";
import { getReport, predict, predictBatch } from "@/lib/api";
import { modelApiId } from "@/lib/config";

const prediction = {
  viral_score: 0.42,
  label: "viral-likely",
  confidence: 0.2,
  top_factors: [],
  explanation_text: "test",
  suggestions: [],
  model: "audience-x90",
};

function mockFetch(payload: unknown = prediction) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => payload,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("AI model selection", () => {
  it("keeps the historic Fusion v1 choice mapped to legacy", () => {
    expect(modelApiId("fusion-v1")).toBe("legacy");
  });

  it("sends audience-x90 to prediction and report endpoints", async () => {
    const fetchMock = mockFetch();

    await predict("EV post", "x", 10_000, "audience-x90");
    await getReport("EV post", "x", 10_000, "en", "audience-x90");

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ model: "audience-x90" });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ model: "audience-x90" });
  });

  it("keeps a model choice on every batch item", async () => {
    const fetchMock = mockFetch([prediction]);

    await predictBatch([
      { text: "Variant A", source: "youtube", audience: null, model: "audience-x90" },
    ]);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.items[0].model).toBe("audience-x90");
  });
});
