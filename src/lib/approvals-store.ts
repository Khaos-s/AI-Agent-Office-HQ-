import fs from "fs";
import path from "path";
import { HITLApproval, ApprovalStatus } from "@/types";

const DATA_DIR = path.resolve(process.cwd(), "data");
const APPROVALS_FILE = path.join(DATA_DIR, "approvals.json");

export const SEED_APPROVALS: HITLApproval[] = [
  {
    id: "app-001",
    agentId: "tbx-shop",
    actionType: "shopify_refund",
    title: "Refund Request: Order #4089",
    description: "Customer requested a $45.00 refund due to delayed shipment.",
    riskLevel: "medium",
    payload: {
      orderId: "4089",
      amount: 45.0,
      currency: "USD",
      customer: "alex.taylor@example.com",
      reason: "Carrier delay over 7 days",
    },
    status: "pending",
    createdAt: new Date("2026-11-06T09:10:00Z").toISOString(),
  },
  {
    id: "app-002",
    agentId: "social",
    actionType: "social_publish",
    title: "X/Twitter Announcement: Agent Office v1",
    description: "Scheduled tweet introducing the 2D virtual HQ canvas and department sub-agents.",
    riskLevel: "low",
    payload: {
      platform: "twitter",
      content: "🚀 Introducing AI Agent Office HQ — watch your AI team collaborate in real-time in a 2D pixel-art virtual headquarters! #AIAgents #OpenSource",
      scheduledFor: "Immediate",
    },
    status: "pending",
    createdAt: new Date("2026-11-06T09:25:00Z").toISOString(),
  },
  {
    id: "app-003",
    agentId: "inbox",
    actionType: "email_send",
    title: "Brand Partnership Reply: Acme Corp",
    description: "Response to Acme Corp sponsorship offer for YouTube video integrations.",
    riskLevel: "high",
    payload: {
      recipient: "partnerships@acme.corp",
      subject: "Re: Antigravity AI Agent Office Sponsorship Inquiry",
      proposedBudget: 3500,
      deliverables: ["1x dedicated review video", "Social mentions"],
    },
    status: "pending",
    createdAt: new Date("2026-11-06T09:40:00Z").toISOString(),
  },
];

function ensureFileExists(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(APPROVALS_FILE)) {
    fs.writeFileSync(APPROVALS_FILE, JSON.stringify(SEED_APPROVALS, null, 2), "utf-8");
  }
}

export function getApprovals(status?: ApprovalStatus): HITLApproval[] {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(APPROVALS_FILE, "utf-8");
    const parsed: HITLApproval[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Approvals store is not an array");
    if (!status) return parsed;
    return parsed.filter((a) => a.status === status);
  } catch (error) {
    fs.writeFileSync(APPROVALS_FILE, JSON.stringify(SEED_APPROVALS, null, 2), "utf-8");
    return status ? SEED_APPROVALS.filter((a) => a.status === status) : SEED_APPROVALS;
  }
}

export function getApprovalById(id: string): HITLApproval | undefined {
  const approvals = getApprovals();
  return approvals.find((a) => a.id === id);
}

export function createApproval(item: Omit<HITLApproval, "id" | "createdAt" | "status">): HITLApproval {
  const approvals = getApprovals();
  const newApproval: HITLApproval = {
    ...item,
    id: `app-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  approvals.unshift(newApproval);
  const tempFile = `${APPROVALS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(approvals, null, 2), "utf-8");
  fs.renameSync(tempFile, APPROVALS_FILE);

  return newApproval;
}

export function resolveApproval(
  id: string,
  status: "approved" | "rejected",
  reviewer: string,
  comment?: string,
  executionReceipt?: Record<string, any>
): HITLApproval {
  const approvals = getApprovals();
  const target = approvals.find((a) => a.id === id);

  if (!target) {
    throw new Error(`Approval item with ID "${id}" not found.`);
  }

  if (target.status !== "pending") {
    throw new Error(`Action already resolved: Item "${id}" is in "${target.status}" status.`);
  }

  target.status = status;
  target.resolvedAt = new Date().toISOString();
  target.resolvedBy = reviewer;
  if (comment) target.resolutionComment = comment;
  if (executionReceipt) target.executionReceipt = executionReceipt;

  const tempFile = `${APPROVALS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(approvals, null, 2), "utf-8");
  fs.renameSync(tempFile, APPROVALS_FILE);

  return target;
}

export function resetApprovalsStore(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(APPROVALS_FILE, JSON.stringify(SEED_APPROVALS, null, 2), "utf-8");
}
