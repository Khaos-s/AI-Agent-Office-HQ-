import { withOperator } from "@/lib/supabase/server";
import { readAgents, saveAgent } from "@/lib/persistent-agents";
import { NextResponse } from "next/server";
import { getAgentById, updateAgentStatus } from "@/lib/agent-registry";
import { createApproval } from "@/lib/approvals-store";
import { addMemory } from "@/lib/memory-store";
import { RiskLevel } from "@/types";

export const dynamic = "force-dynamic";

// Domain-specific prompt execution simulator with realistic responses and safety guardrails
async function handlePOST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
    const { agentId, prompt } = body;

    if (typeof agentId !== "string" || typeof prompt !== "string" || !prompt.trim() || prompt.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Missing agentId or prompt." },
        { status: 400 }
      );
    }

    const agents = await readAgents();
    const agent = getAgentById(agentId, agents);
    if (!agent) {
      return NextResponse.json(
        { success: false, error: `Agent "${agentId}" not found.` },
        { status: 404 }
      );
    }

    const lower = prompt.toLowerCase();

    // 1. Guardrail Check: HITL Gate for Financial / Public Actions
    const isFinancial =
      lower.includes("refund") ||
      lower.includes("discount") ||
      lower.includes("charge") ||
      lower.includes("payout");
    const isPublicPublish =
      lower.includes("tweet") ||
      lower.includes("publish") ||
      lower.includes("send email") ||
      lower.includes("broadcast") ||
      lower.includes("merge to main");

    if (isFinancial || isPublicPublish) {
      // Create HITL approval request
      const risk: RiskLevel = isFinancial ? "high" : "medium";
      const approval = await createApproval({
        agentId: agent.id,
        actionType: isFinancial ? "shopify_refund" : "public_dispatch",
        title: isFinancial
          ? `HITL Financial Gate: ${prompt.substring(0, 40)}`
          : `HITL Public Action: ${prompt.substring(0, 40)}`,
        description: `Simulation requested for @${agent.name}. Requires operator approval; external execution is disabled.`,
        riskLevel: risk,
        payload: {
          prompt,
          agentDepartment: agent.department,
          timestamp: new Date().toISOString(),
          requestedBy: "Operator Console",
        },
      });

      updateAgentStatus(
        agent.id,
        "waiting_approval",
        `Awaiting HITL sign-off: "${prompt.substring(0, 36)}..."`,
        `Held at HITL Gate: Requires operator authorization.`,
        agents
      );

      await saveAgent(agent);
      await addMemory({
        agentId: agent.id,
        title: `HITL Gate Staged: ${prompt.substring(0, 30)}`,
        content: `Operator issued sensitive action: "${prompt}". Automatically queued in The Boss Desk for approval.`,
        tags: ["hitl", "security", agent.department.toLowerCase()],
      });

      return NextResponse.json({
        success: true,
        requiresHITL: true,
        approvalId: approval.id,
        agent: getAgentById(agentId, agents),
        response: `[HITL GATE TRIGGERED] This operation requires human authorization. Action has been staged in The Boss Desk for sign-off.`,
      });
    }

    // 2. Department-Specific AI Response Generation
    let aiResponse = "";
    let updatedTask = "";

    switch (agent.department) {
      case "Executive":
        aiResponse = `[Executive HQ Command] Strategic directive processed. Coordinating cross-department alignment and verifying system invariants. All leads notified.`;
        updatedTask = `Coordinating strategic directive: "${prompt.substring(0, 40)}"`;
        break;

      case "Systems Design":
        aiResponse = `[Systems Architecture] Architecture spec analyzed. Validating distributed state machine contracts, failure domains, and offline sync boundaries.`;
        updatedTask = `Modeling system invariants for: "${prompt.substring(0, 40)}"`;
        break;

      case "Database":
        aiResponse = `[Database DBA] PostgreSQL schema and query plan inspected. Index performance optimal. RLS policies verified against data leak vectors.`;
        updatedTask = `Executing database optimization: "${prompt.substring(0, 40)}"`;
        break;

      case "Integration":
        aiResponse = `[Integration Specialist] Webhook pipeline verified. Event idempotency guaranteed with monotonic deduplication keys.`;
        updatedTask = `Syncing integration stream: "${prompt.substring(0, 40)}"`;
        break;

      case "Security":
        aiResponse = `[Cybersecurity Auditor] Threat modeling complete. Client/server trust boundary intact. Zero secret keys exposed to client bundles.`;
        updatedTask = `Running security boundary audit: "${prompt.substring(0, 40)}"`;
        break;

      case "Engineering":
        aiResponse = `[Full-Stack Lead] Coding session initiated in isolated worktree. Shaders compiled, unit tests passing. Branch staged for pull request.`;
        updatedTask = `Implementing feature branch: "${prompt.substring(0, 40)}"`;
        break;

      case "Quality":
        aiResponse = `[QA Testing] Automated test suite executed. Zero regressions detected across 18 scenario specs. Concurrency assertions green.`;
        updatedTask = `Auditing boundary test scenarios: "${prompt.substring(0, 40)}"`;
        break;

      case "DevOps":
        aiResponse = `[Cloud Infrastructure] Container health checks 100% nominal. Vercel deployment edge routing verified. Zero network packet drops.`;
        updatedTask = `Monitoring cloud infrastructure: "${prompt.substring(0, 40)}"`;
        break;

      case "Research":
        aiResponse = `[GitHub Radar] Scanned trending AI agent repositories. Extracted top frameworks, star velocity, and tacit architectural patterns.`;
        updatedTask = `Scanning open-source AI intelligence: "${prompt.substring(0, 40)}"`;
        break;

      case "Creative":
        aiResponse = `[Motion & Creative] Video composition rendered via programmatic asset pipeline. Color balance and aspect ratio calibrated.`;
        updatedTask = `Composing creative assets: "${prompt.substring(0, 40)}"`;
        break;

      case "Content":
        aiResponse = `[Copywriter] Brand narrative formulated. Concise, honest messaging aligned with developer audience. Editorial review drafted.`;
        updatedTask = `Drafting narrative copy: "${prompt.substring(0, 40)}"`;
        break;

      case "Communications":
        aiResponse = `[Inbox Triager] Inbound stream filtered and classified. High-priority partnership opportunities flagged for review.`;
        updatedTask = `Triaging inbound communications: "${prompt.substring(0, 40)}"`;
        break;

      case "Commerce":
        aiResponse = `[TBX Shop] Store catalogue synchronized. Inventory restock verified across regional fulfillment centers.`;
        updatedTask = `Managing store operations: "${prompt.substring(0, 40)}"`;
        break;

      case "Analytics":
        aiResponse = `[Telemetry Science] Compute telemetry sampled. Real-time agent latency running at 99.8th percentile nominal SLA.`;
        updatedTask = `Aggregating real-time telemetry metrics: "${prompt.substring(0, 40)}"`;
        break;

      case "Performance":
        aiResponse = `[SRE Health] System stamina profiled. Memory garbage collection cycles healthy. Ephemeral cache warmed.`;
        updatedTask = `Profiling system stamina and memory: "${prompt.substring(0, 40)}"`;
        break;

      default:
        aiResponse = `[AI Agent ${agent.name}] Command received: "${prompt}". Task registered and execution pipeline active.`;
        updatedTask = `Processing autonomous task: "${prompt.substring(0, 40)}"`;
    }

    aiResponse = `[SIMULATION — no external action performed] ${aiResponse}`;
    // Only the simulated agent state is persisted; no external tools are executed.
    updateAgentStatus(agent.id, "working", updatedTask, aiResponse, agents);
    await saveAgent(agent);

    // Record action into Shared Brain Memory
    await addMemory({
      agentId: agent.id,
      title: `Prompt Simulation: ${prompt.substring(0, 30)}`,
      content: `Operator Prompt: "${prompt}"\nAgent Response: "${aiResponse}"`,
      tags: ["prompt", "ai-command", agent.department.toLowerCase()],
    });

    return NextResponse.json({
      success: true,
      requiresHITL: false,
      agent: getAgentById(agentId, agents),
      response: aiResponse,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI prompt." },
      { status: 500 }
    );
  }
}


export const POST = withOperator(handlePOST);
