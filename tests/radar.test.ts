import { describe, it, expect } from "vitest";
import {
  calculateRadarScore,
  runRadarScan,
  getRadarData,
} from "@/lib/radar-engine";

describe("GitHub Radar Scoring Engine", () => {
  it("calculates radar score with proper topic weights", () => {
    const highMatch = calculateRadarScore({
      starsGrowth: 450,
      topic: "ai-agents",
      description: "Autonomous multi-agent office headquarters with memory",
      daysSinceLastCommit: 1,
    });

    const lowMatch = calculateRadarScore({
      starsGrowth: 10,
      topic: "voice",
      description: "Simple audio converter tool",
      daysSinceLastCommit: 20,
    });

    expect(highMatch).toBeGreaterThan(lowMatch);
    expect(highMatch).toBeLessThanOrEqual(100);
    expect(lowMatch).toBeGreaterThanOrEqual(0);
  });

  it("handles boundary edge cases without NaN", () => {
    const zeroGrowth = calculateRadarScore({
      starsGrowth: 0,
      topic: "memory",
      description: "",
      daysSinceLastCommit: 90,
    });

    expect(zeroGrowth).not.toBeNaN();
    expect(zeroGrowth).toBeGreaterThanOrEqual(0);
    expect(zeroGrowth).toBeLessThanOrEqual(100);
  });

  it("runs radar scan and writes sorted items to data.json", async () => {
    const results = await runRadarScan();
    expect(results.length).toBeGreaterThan(0);
    // Verifies sorted by score descending
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }

    const fetched = getRadarData();
    expect(fetched.length).toBe(results.length);
    expect(fetched[0].id).toBe(results[0].id);
  });
});
