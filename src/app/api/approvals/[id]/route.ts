import { withOperator } from "@/lib/supabase/server";
import { readAgents, saveAgent } from "@/lib/persistent-agents";
import { requireOperator } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getApprovalById, resolveApproval } from "@/lib/approvals-store";
import { executeApprovedAction } from "@/lib/action-handlers";
import { updateAgentStatus } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";

async function handleGET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const approval = await getApprovalById(id);
  if (!approval) {
    return NextResponse.json({ success: false, error: "Approval not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, approval });
}

async function handlePATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    const { action, comment } = body;
    if (comment !== undefined && (typeof comment !== "string" || comment.length > 2000)) return NextResponse.json({ success: false, error: "Invalid comment." }, { status: 400 });
    const operator = await requireOperator();
    const reviewer = operator?.id ?? "Local Operator";

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const current = await getApprovalById(id);
    if (!current) {
      return NextResponse.json({ success: false, error: "Approval not found" }, { status: 404 });
    }

    if (current.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: `Conflict: Approval is already ${current.status}.`,
        },
        { status: 409 }
      );
    }

    // Execution is a sandbox receipt only; the conditional database update and audit are atomic.
    const receipt = action === "approve" ? await executeApprovedAction(current) : undefined;
    const resolved = await resolveApproval(id, action === "approve" ? "approved" : "rejected", reviewer, comment, receipt);
    const agents = await readAgents();
    const agent = agents.find(a => a.id === current.agentId);
    if (agent) {
      updateAgentStatus(agent.id, action === "approve" ? "working" : "break", `Sandbox action ${action === "approve" ? "approved" : "rejected"}: ${current.title}`, "Decision recorded. External execution is disabled.", agents);
      await saveAgent(agent);
    }

    return NextResponse.json({
      success: true,
      approval: resolved,
      executionReceipt: receipt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to resolve approval." },
      { status: /already resolved/i.test(error.message) ? 409 : 500 }
    );
  }
}


export const GET = withOperator(handleGET);
export const PATCH = withOperator(handlePATCH);
