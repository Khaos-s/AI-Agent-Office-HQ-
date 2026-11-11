import { NextResponse } from "next/server";
import {
  getAllAgents,
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

export async function GET() {
  updateAgentPositions();
  const agents = getAllAgents();
  const pendingApprovals = getApprovals("pending");
  const stats = getCampusStats(pendingApprovals.length);

  return NextResponse.json({
    success: true,
    agents,
    campusStats: stats,
    systemHealth: "healthy",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status, currentTask, speechBubble, destination, targetCoordinates } = body;

    if (typeof id !== "string" || !getAgentById(id)) {
      return NextResponse.json(
        { success: false, error: "Unknown or missing agent ID." },
        { status: 400 }
      );
    }

    if (targetCoordinates !== undefined) {
      if (!targetCoordinates || typeof targetCoordinates.x !== "number" || typeof targetCoordinates.y !== "number" || !isInsideCampus(targetCoordinates.x, targetCoordinates.y)) {
        return NextResponse.json({ success: false, error: "Choose a position inside the office." }, { status: 400 });
      }
      const moved = moveAgentToCoords(id, targetCoordinates.x, targetCoordinates.y);
      return NextResponse.json({ success: true, agent: moved });
    }

    if (destination) {
      if (!["desk", "pantry", "gym", "brain"].includes(destination)) {
        return NextResponse.json({ success: false, error: "Unknown destination." }, { status: 400 });
      }
      const routed = routeAgent(id, destination as RoutingDestination);
      return NextResponse.json({ success: true, agent: routed });
    }

    if (status) {
      const updated = updateAgentStatus(id, status, currentTask, speechBubble);
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
