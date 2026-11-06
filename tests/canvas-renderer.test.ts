import { describe, it, expect } from "vitest";
import { getAgentAtCoordinates } from "@/lib/canvas-renderer";
import { AgentProfile } from "@/types";

describe("Canvas Hit-Testing and Coordinate Calculations", () => {
  const mockAgents: AgentProfile[] = [
    {
      id: "lead",
      name: "Avery Lead",
      department: "Executive",
      role: "Lead",
      modelTier: "opus",
      deskCoordinates: { x: 350, y: 80 },
      color: "#6366f1",
      brief: { whoYouAre: "", job: "", mustNeverDo: "" },
      allowedTools: [],
      disallowedTools: [],
      status: "idle",
    },
    {
      id: "dev",
      name: "Devon Coder",
      department: "Dev",
      role: "Engineer",
      modelTier: "opus",
      deskCoordinates: { x: 580, y: 280 },
      color: "#3b82f6",
      brief: { whoYouAre: "", job: "", mustNeverDo: "" },
      allowedTools: [],
      disallowedTools: [],
      status: "working",
    },
  ];

  it("identifies agent when coordinates are within sprite radius", () => {
    // Exact center hit
    const hitLead = getAgentAtCoordinates(350, 80, mockAgents);
    expect(hitLead?.id).toBe("lead");

    // Near desk boundary (within 35px radius)
    const hitDev = getAgentAtCoordinates(590, 290, mockAgents);
    expect(hitDev?.id).toBe("dev");
  });

  it("returns null when clicking empty floor space", () => {
    const miss = getAgentAtCoordinates(50, 50, mockAgents);
    expect(miss).toBeNull();
  });
});

