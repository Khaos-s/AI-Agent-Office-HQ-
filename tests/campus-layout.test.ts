import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { INITIAL_24_AGENTS, moveAgentToCoords, resetAgentState, updateAgentPositions, getAgentById, routeAgent } from "@/lib/agent-registry";
import { project, unproject, roomAt, isInsideCampus, STATIONS } from "@/lib/campus-layout";
import { agentPositionAt } from "@/lib/agent-movement";
import { POST } from "@/app/api/office/state/route";

describe("Campus placement and journeys", () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(100000); resetAgentState(); });
  afterEach(() => vi.useRealTimers());
  it("places every agent in a room with a unique assigned station", () => {
    expect(new Set(INITIAL_24_AGENTS.map(a => JSON.stringify(a.deskCoordinates))).size).toBe(24);
    for (const agent of INITIAL_24_AGENTS) {
      expect(roomAt(agent.currentCoordinates.x, agent.currentCoordinates.y)?.type).toBe(agent.currentRoom);
      expect(roomAt(agent.deskCoordinates.x, agent.deskCoordinates.y)?.id).toBe(STATIONS[agent.id].room.id);
    }
    const p = project(400, 250);
    expect(unproject(p.x, p.y).x).toBeCloseTo(400);
    expect(unproject(p.x, p.y).y).toBeCloseTo(250);
  });
  it("does not speed up with polling and agrees with the canvas", () => {
    const destination = project(700, 700);
    const agent = moveAgentToCoords("julian", destination.x, destination.y);
    const start = { ...agent.currentCoordinates };
    updateAgentPositions(); updateAgentPositions();
    expect(agent.currentCoordinates).toEqual(start);
    vi.advanceTimersByTime(1000);
    const expected = agentPositionAt(agent, Date.now());
    updateAgentPositions();
    expect(agent.currentCoordinates).toEqual(expected);
    expect(Math.hypot(expected.x - start.x, expected.y - start.y)).toBeCloseTo(85);
    vi.advanceTimersByTime(20000); updateAgentPositions();
    expect(agent.currentCoordinates.x).toBe(destination.x);
    expect(agent.targetCoordinates).toBeUndefined();
    updateAgentPositions(); expect(agent.currentCoordinates.x).toBe(destination.x);
  });
  it("replaces a journey without jumping back to an old snapshot", () => {
    routeAgent("julian", "gym");
    vi.advanceTimersByTime(1000);
    const current = agentPositionAt(getAgentById("julian")!, Date.now());
    const next = routeAgent("julian", "pantry");
    expect(next.movement?.from).toEqual(current);
    expect(roomAt(next.targetCoordinates!.x, next.targetCoordinates!.y)?.type).toBe("pantry");
    expect(agentPositionAt(next, Date.now())).toEqual(current);
  });
  it("keeps all routing destinations inside their intended rooms", () => {
    for (const agent of INITIAL_24_AGENTS) for (const destination of ["desk", "pantry", "gym", "brain"] as const) {
      const target = routeAgent(agent.id, destination).targetCoordinates!;
      expect(isInsideCampus(target.x, target.y)).toBe(true);
      expect(roomAt(target.x, target.y)?.type).toBe(destination === "desk" ? STATIONS[agent.id].room.type : destination);
    }
  });
  it("rejects invalid movement input without changing the agent", async () => {
    const start = { ...getAgentById("julian")!.currentCoordinates };
    for (const targetCoordinates of [{ x: -20, y: 0 }, { x: "500", y: 400 }, { x: null, y: 400 }]) {
      const response = await POST(new Request("http://localhost/api/office/state", { method: "POST", body: JSON.stringify({ id: "julian", targetCoordinates }) }));
      expect(response.status).toBe(400);
    }
    expect(() => moveAgentToCoords("julian", Infinity, NaN)).toThrow();
    expect(getAgentById("julian")!.currentCoordinates).toEqual(start);
  });
});
