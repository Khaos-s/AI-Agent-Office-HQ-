import type { AgentProfile } from "@/types";

export const WALK_SPEED = 85;

// Both the server and canvas sample the same journey; polling never restarts a walk.
// shortcut: journeys cross furniture directly; add obstacle routing when furniture becomes interactive.
export function agentPositionAt(agent: AgentProfile, now: number) {
  if (!agent.movement || !agent.targetCoordinates) return { ...agent.currentCoordinates };
  const { from, startedAt } = agent.movement;
  const target = agent.targetCoordinates;
  const distance = Math.hypot(target.x - from.x, target.y - from.y);
  const progress = distance === 0 ? 1 : Math.min(1, Math.max(0, now - startedAt) * WALK_SPEED / 1000 / distance);
  return { x: from.x + (target.x - from.x) * progress, y: from.y + (target.y - from.y) * progress };
}
