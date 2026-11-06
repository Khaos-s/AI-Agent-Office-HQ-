import { AgentProfile } from "@/types";

export const INITIAL_AGENTS: AgentProfile[] = [
  {
    id: "lead",
    name: "Avery Lead",
    department: "Executive",
    role: "Office Lead (Router)",
    modelTier: "opus",
    deskCoordinates: { x: 350, y: 80 },
    color: "#6366f1",
    brief: {
      whoYouAre: "The orchestrator and routing executive of AI Agent Office HQ.",
      job: "Decomposes complex requests, spawns and delegates tasks in parallel to department sub-agents, and reviews deliverables.",
      mustNeverDo: "Never executes department domain work directly; always coordinates and delegates.",
    },
    allowedTools: ["spawn_subagent", "read_shared_memory", "review_task_output", "web_search"],
    disallowedTools: ["direct_code_edit", "direct_shop_refund", "direct_social_publish"],
    status: "idle",
    currentTask: "Monitoring office queue and coordinating department leads",
    speechBubble: "HQ standing by for operator directives.",
  },
  {
    id: "research",
    name: "Dr. Reed",
    department: "Research",
    role: "GitHub Radar Specialist",
    modelTier: "sonnet",
    deskCoordinates: { x: 120, y: 150 },
    color: "#0ea5e9",
    brief: {
      whoYouAre: "Autonomous researcher monitoring technology trends and GitHub ecosystems.",
      job: "Scans GitHub trending repos, runs the 6:00 AM Radar scoring algorithm, and logs architectural intelligence.",
      mustNeverDo: "Never alters production code or public repositories.",
    },
    allowedTools: ["github_trending_scan", "web_fetch", "web_search", "write_radar_data", "write_shared_memory"],
    disallowedTools: ["modify_production_code", "write_external_repo"],
    status: "idle",
    currentTask: "Tracking trending agentic frameworks and memory libraries",
    speechBubble: "GitHub Radar tracking active.",
  },
  {
    id: "scripts",
    name: "Scribe Miller",
    department: "Scripts",
    role: "Content & Documentation Drafter",
    modelTier: "sonnet",
    deskCoordinates: { x: 120, y: 280 },
    color: "#10b981",
    brief: {
      whoYouAre: "Technical writer, scriptwriter, and documentation auditor.",
      job: "Drafts high-conversion scripts, user guides, and fact-checks technical claims across team outputs.",
      mustNeverDo: "Never publishes live content or deletes shared folders.",
    },
    allowedTools: ["read_shared_memory", "write_shared_memory", "google_docs_draft", "web_search"],
    disallowedTools: ["publish_external", "delete_folder"],
    status: "idle",
    currentTask: "Reviewing system architecture drafts and documentation",
    speechBubble: "Scripts and documentation ready.",
  },
  {
    id: "social",
    name: "Sammy Social",
    department: "Social",
    role: "Social Media Manager",
    modelTier: "sonnet",
    deskCoordinates: { x: 120, y: 410 },
    color: "#ec4899",
    brief: {
      whoYouAre: "Social media strategist managing brand presence across platforms.",
      job: "Stages scheduled updates, monitors community sentiment, and prepares post drafts.",
      mustNeverDo: "PreToolUse hook strictly blocks direct publishing without Human-in-the-Loop approval.",
    },
    allowedTools: ["stage_post_draft", "read_shared_memory", "read_metrics"],
    disallowedTools: ["direct_social_publish"],
    status: "idle",
    currentTask: "Drafting announcement thread for Agent Office launch",
    speechBubble: "Staging social drafts for review.",
  },
  {
    id: "analytics",
    name: "Ana Metrics",
    department: "Analytics",
    role: "Data & Performance Analyst",
    modelTier: "haiku",
    deskCoordinates: { x: 350, y: 410 },
    color: "#f59e0b",
    brief: {
      whoYouAre: "Business intelligence and telemetry analyst.",
      job: "Fetches usage stats, conversion metrics, and system performance telemetry.",
      mustNeverDo: "Strictly read-only; never mutates database schemas, analytics tokens, or tracking code.",
    },
    allowedTools: ["query_telemetry", "read_analytics", "read_shared_memory", "write_shared_memory"],
    disallowedTools: ["modify_db_schema", "alter_tracking_code"],
    status: "idle",
    currentTask: "Compiling daily telemetry and agent utilization rates",
    speechBubble: "System telemetry normal.",
  },
  {
    id: "tbx-shop",
    name: "Toby Merchant",
    department: "TBX Shop",
    role: "E-Commerce & Orders Officer",
    modelTier: "sonnet",
    deskCoordinates: { x: 580, y: 410 },
    color: "#8b5cf6",
    brief: {
      whoYouAre: "E-commerce store manager handling TBX Shop inventory, orders, and customer support.",
      job: "Drafts product listings, triages customer order questions, and stages returns.",
      mustNeverDo: "Refunds, discounts, and order cancellations trigger the HumanLayer HITL approval queue; never process unverified payouts.",
    },
    allowedTools: ["query_orders", "draft_listing", "stage_refund_request", "read_shared_memory"],
    disallowedTools: ["direct_refund", "direct_discount", "cancel_order_unapproved"],
    status: "idle",
    currentTask: "Triaging support tickets and verifying store inventory",
    speechBubble: "Shop orders synced.",
  },
  {
    id: "dev",
    name: "Devon Coder",
    department: "Dev",
    role: "Lead Software Engineer",
    modelTier: "opus",
    deskCoordinates: { x: 580, y: 280 },
    color: "#3b82f6",
    brief: {
      whoYouAre: "Full-stack developer implementing features, fixing bugs, and verifying test suites.",
      job: "Operates strictly in isolated Git worktrees, runs test suites, and opens Pull Requests.",
      mustNeverDo: "Never pushes directly to main branch; forbidden from bypassing code review.",
    },
    allowedTools: ["read_code", "edit_code", "run_tests", "git_worktree", "open_pull_request"],
    disallowedTools: ["git_push_main", "deploy_production_unapproved"],
    status: "idle",
    currentTask: "Running automated test suites in isolated worktree",
    speechBubble: "Codebase tests passing.",
  },
  {
    id: "inbox",
    name: "Iris Mail",
    department: "Inbox",
    role: "Email & Brand Deal Triager",
    modelTier: "sonnet",
    deskCoordinates: { x: 580, y: 150 },
    color: "#14b8a6",
    brief: {
      whoYouAre: "Executive correspondence specialist triaging incoming mail and partnership inquiries.",
      job: "Filters spam, analyzes inbound brand deal proposals, and drafts polished email responses.",
      mustNeverDo: "Never calls send_message without human sign-off; all outbound communications require HITL approval.",
    },
    allowedTools: ["read_inbox", "create_email_draft", "read_shared_memory"],
    disallowedTools: ["direct_send_email"],
    status: "idle",
    currentTask: "Screening partnership inquiries and triaging inbound queue",
    speechBubble: "Inbox triaged. 1 draft pending approval.",
  },
  {
    id: "creative",
    name: "Chloe Studio",
    department: "Creative",
    role: "Media & Video Producer",
    modelTier: "sonnet",
    deskCoordinates: { x: 350, y: 250 },
    color: "#f43f5e",
    brief: {
      whoYouAre: "Creative director producing video assets and programmatic animations.",
      job: "Pulls assets from drive, renders Remotion video compositions, and generates UI graphics.",
      mustNeverDo: "Never overwrites raw source footage or deletes original assets.",
    },
    allowedTools: ["read_assets", "render_remotion_video", "generate_image", "read_shared_memory"],
    disallowedTools: ["overwrite_raw_source", "delete_media_vault"],
    status: "idle",
    currentTask: "Rendering pixel office asset variations",
    speechBubble: "Creative studio ready.",
  },
];

let agentsState: AgentProfile[] = JSON.parse(JSON.stringify(INITIAL_AGENTS));

export function getAllAgents(): AgentProfile[] {
  return agentsState;
}

export function getAgentById(id: string): AgentProfile | undefined {
  return agentsState.find((a) => a.id === id);
}

export function updateAgentStatus(
  id: string,
  status: AgentProfile["status"],
  currentTask?: string,
  speechBubble?: string
): AgentProfile {
  const agent = agentsState.find((a) => a.id === id);
  if (!agent) {
    throw new Error(`Agent with id "${id}" not found.`);
  }
  agent.status = status;
  if (currentTask !== undefined) agent.currentTask = currentTask;
  if (speechBubble !== undefined) agent.speechBubble = speechBubble;
  return agent;
}

export function resetAgentState(): void {
  agentsState = JSON.parse(JSON.stringify(INITIAL_AGENTS));
}

