export type CampusStatus =
  | "working"
  | "eating"
  | "gym"
  | "meeting"
  | "break"
  | "arriving"
  | "waiting_approval"
  | "awaiting_approval"
  | "idle"
  | "thinking"
  | "error";

export type AgentStatus = CampusStatus;

export type RoutingDestination = "desk" | "pantry" | "gym" | "brain";

export type RoomLocation =
  | "overview"
  | "focus_work"
  | "all_hands"
  | "pantry"
  | "gym"
  | "brain"
  | "server_bay"
  | "exterior";

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
  shortRole?: string;
  modelTier: ModelTier;
  color: string;
  avatarIcon?: string;
  
  // Spatial coordinates (2D and 3D compatible)
  deskCoordinates: { x: number; y: number; z?: number };
  currentCoordinates: { x: number; y: number; z?: number };
  targetCoordinates?: { x: number; y: number; z?: number };
  
  currentRoom: RoomLocation;
  status: CampusStatus;
  currentTask: string;
  speechBubble?: string;

  brief: AgentBrief;
  allowedTools: string[];
  disallowedTools: string[];
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

export interface CampusStats {
  total: number;
  working: number;
  eating: number;
  gym: number;
  meeting: number;
  breakCount: number;
  arriving: number;
  waitingApproval: number;
  openTasks: number;
  accessories: number;
}
