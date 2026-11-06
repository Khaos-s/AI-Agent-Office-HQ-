import { describe, it, expect } from "vitest";
import { getAgentAtIsometricCoords } from "@/lib/isometric-campus-renderer";
import { AgentProfile } from "@/types";

describe("Isometric Campus Hit-Testing and Coordinate Calculations", () => {
  const mockAgents: AgentProfile[] = [
    {
      id: "josiah",
      name: "Josiah",
      department: "Executive",
      role: "Founder & Lead Architect",
      modelTier: "opus",
      color: "#6366f1",
      deskCoordinates: { x: 400, y: 250, z: 0 },
      currentCoordinates: { x: 260, y: 360, z: 0 },
      currentRoom: "gym",
      status: "gym",
      currentTask: "Active recovery workout",
      brief: { whoYouAre: "", job: "", mustNeverDo: "" },
      allowedTools: [],
      disallowedTools: [],
    },
    {
      id: "julian",
      name: "Julian",
      department: "Systems Design",
      role: "Systems Design Specialist",
      modelTier: "opus",
      color: "#a855f7",
      deskCoordinates: { x: 260, y: 155, z: 0 },
      currentCoordinates: { x: 260, y: 155, z: 0 },
      currentRoom: "focus_work",
      status: "working",
      currentTask: "Architecture",
      brief: { whoYouAre: "", job: "", mustNeverDo: "" },
      allowedTools: [],
      disallowedTools: [],
    },
  ];

  it("identifies agent when coordinates are within hit radius", () => {
    const hitJosiah = getAgentAtIsometricCoords(260, 360, mockAgents);
    expect(hitJosiah?.id).toBe("josiah");

    const hitJulian = getAgentAtIsometricCoords(265, 158, mockAgents);
    expect(hitJulian?.id).toBe("julian");
  });

  it("returns null when clicking empty floor space", () => {
    const miss = getAgentAtIsometricCoords(50, 50, mockAgents);
    expect(miss).toBeNull();
  });
});
