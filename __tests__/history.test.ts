import { describe, it, expect, beforeEach } from "vitest";
import { addHistory, getHistory, updateHistory, deleteHistory, clearHistory, HistoryItem } from "@/lib/history";

function makeItem(id: string): HistoryItem {
  return {
    id,
    ts: Date.now(),
    text: `post ${id}`,
    scores: { youtube: 0.8, x: 0.3, reddit: 0.5 },
    best: { source: "youtube", score: 0.8, label: "viral-likely" },
  };
}

describe("history (localStorage)", () => {
  beforeEach(() => clearHistory());

  it("adds and reads items (newest first)", () => {
    addHistory(makeItem("a"));
    addHistory(makeItem("b"));
    const items = getHistory();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe("b");
  });

  it("updates an item by id", () => {
    addHistory(makeItem("a"));
    updateHistory("a", { title: "Renamed" });
    expect(getHistory()[0].title).toBe("Renamed");
  });

  it("deletes an item by id", () => {
    addHistory(makeItem("a"));
    addHistory(makeItem("b"));
    deleteHistory("a");
    const items = getHistory();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("b");
  });

  it("caps history at 200 items", () => {
    for (let i = 0; i < 205; i++) addHistory(makeItem(`i${i}`));
    expect(getHistory()).toHaveLength(200);
  });

  it("clears all items", () => {
    addHistory(makeItem("a"));
    clearHistory();
    expect(getHistory()).toHaveLength(0);
  });
});
