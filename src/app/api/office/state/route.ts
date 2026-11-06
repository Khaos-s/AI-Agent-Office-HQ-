import { NextResponse } from "next/server";
import { getAllAgents, updateAgentStatus } from "@/lib/agent-registry";

export async function GET() {
  const agents = getAllAgents();
  return NextResponse.json({
    success: true,
    agents,
    officeStats: {
      totalAgents: agents.length,
      activeAgents: agents.filter((a) => a.status === "working" || a.status === "thinking").length,
      awaitingApproval: agents.filter((a) => a.status === "awaiting_approval").length,
      systemHealth: "healthy",
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status, currentTask, speechBubble } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id and status." },
        { status: 400 }
      );
    }

    const updated = updateAgentStatus(id, status, currentTask, speechBubble);
    return NextResponse.json({ success: true, agent: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update agent status." },
      { status: 500 }
    );
  }
}
