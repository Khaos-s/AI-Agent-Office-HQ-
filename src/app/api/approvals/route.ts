import { NextResponse } from "next/server";
import { getApprovals, createApproval } from "@/lib/approvals-store";
import { ApprovalStatus, RiskLevel } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") as ApprovalStatus) || undefined;
  const approvals = getApprovals(status);
  return NextResponse.json({ success: true, count: approvals.length, approvals });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, actionType, title, description, riskLevel, payload } = body;

    if (!agentId || !actionType || !title || !description || !payload) {
      return NextResponse.json(
        { success: false, error: "Missing required approval fields." },
        { status: 400 }
      );
    }

    const created = createApproval({
      agentId,
      actionType,
      title,
      description,
      riskLevel: (riskLevel as RiskLevel) || "medium",
      payload,
    });

    return NextResponse.json({ success: true, approval: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create approval request." },
      { status: 500 }
    );
  }
}

