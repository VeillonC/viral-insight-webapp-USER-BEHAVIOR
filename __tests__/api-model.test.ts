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
  const fetchMock = vi.fn().mockResolvedValue(mockResponse(payload));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function mockResponse(payload: unknown, status = 200) {
  return {
    status,
    statusText: status === 200 || status === 202 ? "OK" : "Not Found",
    text: async () => JSON.stringify(payload),
    ok: status >= 200 && status < 300,
    json: async () => payload,
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("AI model selection", () => {
  it("keeps the historic Fusion v1 choice mapped to legacy", () => {
    expect(modelApiId("fusion-v1")).toBe("legacy");
  });

  it("sends audience-x90 to prediction and report endpoints", async () => {
    const report = { report: "queued report", prediction };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(prediction))
      .mockResolvedValueOnce(mockResponse({
        job_id: "job-1",
        status: "succeeded",
        position: null,
        submitted_at: 1,
        started_at: 1,
        finished_at: 2,
        result: report,
      }, 202));
    vi.stubGlobal("fetch", fetchMock);

    await predict("EV post", "x", 10_000, "audience-x90");
    await getReport("EV post", "x", 10_000, "en", "audience-x90");

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ model: "audience-x90" });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ model: "audience-x90" });
    expect(fetchMock.mock.calls[1][0]).toContain("/report/jobs");
  });

  it("polls a queued report until it succeeds", async () => {
    vi.useFakeTimers();
    const result = { report: "ready", prediction };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse({
        job_id: "job-2", status: "queued", position: 1,
        submitted_at: 1, started_at: null, finished_at: null,
      }, 202))
      .mockResolvedValueOnce(mockResponse({
        job_id: "job-2", status: "succeeded", position: null,
        submitted_at: 1, started_at: 2, finished_at: 3, result,
      }));
    vi.stubGlobal("fetch", fetchMock);

    const reportPromise = getReport("EV post", "x", null, "en", "legacy");
    await vi.advanceTimersByTimeAsync(1_000);

    await expect(reportPromise).resolves.toEqual(result);
    expect(fetchMock.mock.calls[1][0]).toContain("/report/jobs/job-2");
  });

  it("falls back to the synchronous endpoint on an older API", async () => {
    const result = { report: "legacy report", prediction };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse({ detail: "Not Found" }, 404))
      .mockResolvedValueOnce(mockResponse(result));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getReport("EV post", "reddit", null, "en", "legacy")).resolves.toEqual(result);
    expect(fetchMock.mock.calls[0][0]).toContain("/report/jobs");
    expect(fetchMock.mock.calls[1][0]).toMatch(/\/report$/);
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
