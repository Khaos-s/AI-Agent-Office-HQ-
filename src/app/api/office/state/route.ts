import { NextResponse } from "next/server";
import {
  getAllAgents,
  updateAgentStatus,
  routeAgent,
  moveAgentToCoords,
  updateAgentPositions,
  getCampusStats,
  RoutingDestination,
} from "@/lib/agent-registry";
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing agent ID." },
        { status: 400 }
      );
    }

    if (targetCoordinates && typeof targetCoordinates.x === "number" && typeof targetCoordinates.y === "number") {
      const moved = moveAgentToCoords(id, targetCoordinates.x, targetCoordinates.y);
      return NextResponse.json({ success: true, agent: moved });
    }

    if (destination) {
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
