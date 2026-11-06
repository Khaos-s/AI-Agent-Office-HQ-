import { NextResponse } from "next/server";
import { getApprovalById, resolveApproval } from "@/lib/approvals-store";
import { executeApprovedAction } from "@/lib/action-handlers";
import { updateAgentStatus } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const approval = getApprovalById(params.id);
  if (!approval) {
    return NextResponse.json({ success: false, error: "Approval not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, approval });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, reviewer = "Operator", comment } = body;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const current = getApprovalById(params.id);
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

    let receipt: Record<string, any> | undefined;

    if (action === "approve") {
      receipt = await executeApprovedAction(current);
      // Update requesting agent status back to working or idle
      try {
        updateAgentStatus(
          current.agentId,
          "working",
          `Executing approved action: ${current.title}`,
          "Action approved! Proceeding with execution."
        );
      } catch (e) {
        // Agent id might be generic
      }
    } else {
      // Action rejected
      try {
        updateAgentStatus(
          current.agentId,
          "idle",
          `Standby (Action rejected: ${current.title})`,
          "Action was rejected by human operator."
        );
      } catch (e) {
        // Ignore
      }
    }

    const resolved = resolveApproval(
      params.id,
      action === "approve" ? "approved" : "rejected",
      reviewer,
      comment,
      receipt
    );

    return NextResponse.json({
      success: true,
      approval: resolved,
      executionReceipt: receipt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to resolve approval." },
      { status: 500 }
    );
  }
}

