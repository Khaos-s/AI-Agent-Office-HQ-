import { withOperator } from "@/lib/supabase/server";
import { readAgents, saveAgent } from "@/lib/persistent-agents";
import { NextResponse } from "next/server";
import {
  getAgentById,
  updateAgentStatus,
  routeAgent,
  moveAgentToCoords,
  updateAgentPositions,
  getCampusStats,
} from "@/lib/agent-registry";
import { isInsideCampus } from "@/lib/campus-layout";
import { RoutingDestination } from "@/types";
import { getApprovals } from "@/lib/approvals-store";

export const dynamic = "force-dynamic";

async function handleGET() {
  const agents = await readAgents();
  updateAgentPositions(Date.now(), agents);
  const pendingApprovals = await getApprovals("pending");
  const stats = getCampusStats(pendingApprovals.length, agents);

  return NextResponse.json({
    success: true,
    agents,
    campusStats: stats,
    systemHealth: "healthy",
    timestamp: new Date().toISOString(),
  });
}

async function handlePOST(request: Request) {
  try {
    const agents = await readAgents();
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
    const { id, status, currentTask, speechBubble, destination, targetCoordinates } = body;

    if (typeof id !== "string" || !getAgentById(id, agents)) {
      return NextResponse.json(
        { success: false, error: "Unknown or missing agent ID." },
        { status: 400 }
      );
    }

    if (targetCoordinates !== undefined) {
      if (!targetCoordinates || typeof targetCoordinates.x !== "number" || typeof targetCoordinates.y !== "number" || !isInsideCampus(targetCoordinates.x, targetCoordinates.y)) {
        return NextResponse.json({ success: false, error: "Choose a position inside the office." }, { status: 400 });
      }
      const moved = moveAgentToCoords(id, targetCoordinates.x, targetCoordinates.y, agents);
      await saveAgent(moved);
      return NextResponse.json({ success: true, agent: moved });
    }

    if (destination) {
      if (!["desk", "pantry", "gym", "brain"].includes(destination)) {
        return NextResponse.json({ success: false, error: "Unknown destination." }, { status: 400 });
      }
      const routed = routeAgent(id, destination as RoutingDestination, agents);
      await saveAgent(routed);
      return NextResponse.json({ success: true, agent: routed });
    }

    if (status) {
      if (!["working","eating","gym","meeting","break","arriving","waiting_approval","awaiting_approval","idle","thinking","error"].includes(status) || (currentTask !== undefined && (typeof currentTask !== "string" || currentTask.length > 2000)) || (speechBubble !== undefined && (typeof speechBubble !== "string" || speechBubble.length > 2000))) {
        return NextResponse.json({ success: false, error: "Invalid agent state." }, { status: 400 });
      }
      const updated = updateAgentStatus(id, status, currentTask, speechBubble, agents);
      await saveAgent(updated);
      return NextResponse.json({ success: true, agent: updated });
    }

    return NextResponse.json(
      { success: false, error: "Must specify destination or status to update." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update agent." },
      { status: 500 }
    );
  }
}

export const GET = withOperator(handleGET);
export const POST = withOperator(handlePOST);
