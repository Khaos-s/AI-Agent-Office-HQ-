import { withOperator } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getApprovals, createApproval } from "@/lib/approvals-store";
import { ApprovalStatus, RiskLevel } from "@/types";

export const dynamic = "force-dynamic";

async function handleGET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") as ApprovalStatus) || undefined;
  const approvals = await getApprovals(status);
  return NextResponse.json({ success: true, count: approvals.length, approvals });
}

async function handlePOST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    const { agentId, actionType, title, description, riskLevel, payload } = body;

    if (typeof agentId !== "string" || !agentId.trim() || agentId.length > 80 || [actionType, title, description].some(value => typeof value !== "string" || !value.trim() || value.length > 4000) || !payload || typeof payload !== "object" || Array.isArray(payload) || JSON.stringify(payload).length > 20000 || (riskLevel !== undefined && !["low", "medium", "high", "critical"].includes(riskLevel))) {
      return NextResponse.json(
        { success: false, error: "Missing required approval fields." },
        { status: 400 }
      );
    }

    const created = await createApproval({
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


export const GET = withOperator(handleGET);
export const POST = withOperator(handlePOST);
