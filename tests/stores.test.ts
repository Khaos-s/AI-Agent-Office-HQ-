import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  getAllAgents,
  getAgentById,
  updateAgentStatus,
} from "@/lib/agent-registry";
import {
  getMemories,
  addMemory,
  resetMemoryStore,
} from "@/lib/memory-store";
import {
  getApprovals,
  createApproval,
  resolveApproval,
  resetApprovalsStore,
} from "@/lib/approvals-store";

describe("Agent Registry", () => {
  it("registers all 9 specialized departments", () => {
    const agents = getAllAgents();
    expect(agents.length).toBe(9);
    const ids = agents.map((a) => a.id);
    expect(ids).toContain("lead");
    expect(ids).toContain("research");
    expect(ids).toContain("scripts");
    expect(ids).toContain("social");
    expect(ids).toContain("analytics");
    expect(ids).toContain("tbx-shop");
    expect(ids).toContain("dev");
    expect(ids).toContain("inbox");
    expect(ids).toContain("creative");
  });

  it("enforces strict guardrails per department", () => {
    const dev = getAgentById("dev");
    expect(dev).toBeDefined();
    expect(dev?.disallowedTools).toContain("git_push_main");
    expect(dev?.brief.mustNeverDo).toContain("main");

    const shop = getAgentById("tbx-shop");
    expect(shop?.disallowedTools).toContain("direct_refund");
    expect(shop?.brief.mustNeverDo).toContain("HITL");
  });

  it("updates agent status and task", () => {
    const updated = updateAgentStatus("research", "working", "Scanning GitHub Radar");
    expect(updated.status).toBe("working");
    expect(updated.currentTask).toBe("Scanning GitHub Radar");

    const fetched = getAgentById("research");
    expect(fetched?.status).toBe("working");
  });
});

describe("Shared Brain (Memory Store)", () => {
  beforeEach(() => {
    resetMemoryStore();
  });

  it("retrieves seeded memories and supports adding new ones", () => {
    const initial = getMemories();
    expect(initial.length).toBeGreaterThan(0);

    const newEntry = addMemory({
      agentId: "research",
      title: "New AI Framework Discovery",
      content: "Discovered Pixel Agents v2 architecture.",
      tags: ["ai-agents", "architecture"],
    });

    expect(newEntry.id).toBeDefined();
    expect(newEntry.createdAt).toBeDefined();

    const tagged = getMemories("ai-agents");
    expect(tagged.some((m) => m.id === newEntry.id)).toBe(true);
  });

  it("self-heals if memory store file is corrupted or missing", () => {
    const dataDir = path.resolve(process.cwd(), "data");
    const memFile = path.join(dataDir, "memory.json");
    fs.writeFileSync(memFile, "{ corrupt json ...", "utf-8");

    const memories = getMemories();
    expect(memories.length).toBeGreaterThan(0);
  });
});

describe("HITL Approvals Store", () => {
  beforeEach(() => {
    resetApprovalsStore();
  });

  it("manages pending approvals and enforces state machine transitions", () => {
    const item = createApproval({
      agentId: "tbx-shop",
      actionType: "shopify_refund",
      title: "Refund Order #1042",
      description: "Customer requested refund for damaged item.",
      riskLevel: "high",
      payload: { orderId: "1042", amount: 89.99, currency: "USD" },
    });

    expect(item.status).toBe("pending");

    const resolved = resolveApproval(item.id, "approved", "Chief Operator", "Customer photos verified");
    expect(resolved.status).toBe("approved");
    expect(resolved.resolvedBy).toBe("Chief Operator");
    expect(resolved.resolvedAt).toBeDefined();

    // Double approval must throw conflict error
    expect(() => {
      resolveApproval(item.id, "rejected", "Chief Operator");
    }).toThrow(/already resolved|conflict/i);
  });

  it("self-heals if approvals store file is corrupted or missing", () => {
    const dataDir = path.resolve(process.cwd(), "data");
    const appFile = path.join(dataDir, "approvals.json");
    fs.writeFileSync(appFile, "INVALID JSON DATA", "utf-8");

    const approvals = getApprovals();
    expect(approvals.length).toBeGreaterThan(0);
  });
});

