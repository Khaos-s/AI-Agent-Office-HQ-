import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  getAllAgents,
  getAgentById,
  updateAgentStatus,
  routeAgent,
  getCampusStats,
  resetAgentState,
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

describe("Agent Registry & Campus Roster", () => {
  beforeEach(() => {
    resetAgentState();
  });

  it("registers all 24 agents across campus rooms", async () => {
    const agents = getAllAgents();
    expect(agents.length).toBe(24);
    const ids = agents.map((a) => a.id);
    expect(ids).toContain("josiah");
    expect(ids).toContain("gian");
    expect(ids).toContain("julian");
    expect(ids).toContain("arwin");
    expect(ids).toContain("blaze");
    expect(ids).toContain("roy-jhan");
  });

  it("enforces strict guardrails per department", async () => {
    const dev = getAgentById("blaze");
    expect(dev).toBeDefined();
    expect(dev?.disallowedTools).toContain("git_push_main");
    expect(dev?.brief.mustNeverDo).toContain("main");

    const shop = getAgentById("gabriel");
    expect(shop?.disallowedTools).toContain("direct_refund");
    expect(shop?.brief.mustNeverDo).toContain("HITL");
  });

  it("updates agent status and task", async () => {
    const updated = updateAgentStatus("keiru", "working", "Scanning GitHub Radar");
    expect(updated.status).toBe("working");
    expect(updated.currentTask).toBe("Scanning GitHub Radar");

    const fetched = getAgentById("keiru");
    expect(fetched?.status).toBe("working");
  });

  it("routes agents to rooms with target coordinates", async () => {
    const routed = routeAgent("josiah", "brain");
    expect(routed.currentRoom).toBe("brain");
    expect(routed.status).toBe("meeting");
    expect(routed.targetCoordinates).toBeDefined();
    expect(routed.targetCoordinates?.x).toBeGreaterThan(350);
  });

  it("calculates accurate campus stats matching live counter", async () => {
    const stats = getCampusStats(0);
    expect(stats.total).toBe(24);
    expect(stats.working).toBe(6);
    expect(stats.eating).toBe(1);
    expect(stats.gym).toBe(2);
    expect(stats.meeting).toBe(3);
    expect(stats.breakCount).toBe(12);
    expect(stats.waitingApproval).toBe(0);
  });
});

describe("Shared Brain (Memory Store)", () => {
  beforeEach(() => {
    resetMemoryStore();
  });

  it("retrieves seeded memories and supports adding new ones", async () => {
    const initial = await getMemories();
    expect(initial.length).toBeGreaterThan(0);

    const newEntry = await addMemory({
      agentId: "research",
      title: "New AI Framework Discovery",
      content: "Discovered Claw3D and OpenClaw architecture.",
      tags: ["ai-agents", "architecture"],
    });

    expect(newEntry.id).toBeDefined();
    expect(newEntry.createdAt).toBeDefined();

    const tagged = await getMemories("ai-agents");
    expect(tagged.some((m) => m.id === newEntry.id)).toBe(true);
  });

  it("self-heals if memory store file is corrupted or missing", async () => {
    const dataDir = path.resolve(process.env.OFFICE_DATA_DIR || process.cwd(), "data");
    const memFile = path.join(dataDir, "memory.json");
    fs.writeFileSync(memFile, "{ corrupt json ...", "utf-8");

    const memories = await getMemories();
    expect(memories.length).toBeGreaterThan(0);
  });
});

describe("HITL Approvals Store", () => {
  beforeEach(() => {
    resetApprovalsStore();
  });

  it("manages pending approvals and enforces state machine transitions", async () => {
    const item = await createApproval({
      agentId: "gabriel",
      actionType: "shopify_refund",
      title: "Refund Order #1042",
      description: "Customer requested refund for damaged item.",
      riskLevel: "high",
      payload: { orderId: "1042", amount: 89.99, currency: "USD" },
    });

    expect(item.status).toBe("pending");

    const resolved = await resolveApproval(item.id, "approved", "Chief Operator", "Customer photos verified");
    expect(resolved.status).toBe("approved");
    expect(resolved.resolvedBy).toBe("Chief Operator");
    expect(resolved.resolvedAt).toBeDefined();

    // Double approval must throw conflict error
    await expect(async () => {
      await resolveApproval(item.id, "rejected", "Chief Operator");
    }).rejects.toThrow(/already resolved|conflict/i);
  });

  it("self-heals if approvals store file is corrupted or missing", async () => {
    const dataDir = path.resolve(process.env.OFFICE_DATA_DIR || process.cwd(), "data");
    const appFile = path.join(dataDir, "approvals.json");
    fs.writeFileSync(appFile, "INVALID JSON DATA", "utf-8");

    const approvals = await getApprovals();
    expect(approvals.length).toBeGreaterThan(0);
  });
});
