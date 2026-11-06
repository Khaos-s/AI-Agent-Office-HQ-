export type AgentStatus = "idle" | "thinking" | "working" | "awaiting_approval" | "error";

export type ModelTier = "opus" | "sonnet" | "haiku";

export interface AgentBrief {
  whoYouAre: string;
  job: string;
  mustNeverDo: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  department: string;
  role: string;
  modelTier: ModelTier;
  deskCoordinates: {
    x: number;
    y: number;
  };
  color: string;
  brief: AgentBrief;
  allowedTools: string[];
  disallowedTools: string[];
  status: AgentStatus;
  currentTask?: string;
  speechBubble?: string;
}

export interface MemoryEntry {
  id: string;
  agentId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface HITLApproval {
  id: string;
  agentId: string;
  actionType: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  payload: Record<string, any>;
  status: ApprovalStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionComment?: string;
  executionReceipt?: Record<string, any>;
}

export type RadarTopic = "ai-agents" | "memory" | "video" | "voice";

export interface RadarItem {
  id: string;
  repo: string;
  description: string;
  stars: number;
  starsGrowth: number;
  topic: RadarTopic;
  score: number;
  url: string;
  lastScannedAt: string;
}
