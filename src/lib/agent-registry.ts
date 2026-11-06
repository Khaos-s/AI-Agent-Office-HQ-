import { AgentProfile, CampusStatus, CampusStats, RoomLocation } from "@/types";

export const INITIAL_24_AGENTS: AgentProfile[] = [
  // 1. Central Holographic Command / The Brain
  {
    id: "josiah",
    name: "Josiah",
    department: "Executive",
    role: "Founder & Lead Architect",
    shortRole: "Founder & Lead",
    modelTier: "opus",
    color: "#6366f1",
    deskCoordinates: { x: 400, y: 250, z: 0 },
    currentCoordinates: { x: 260, y: 360, z: 0 }, // currently in gym per screenshot
    currentRoom: "gym",
    status: "gym",
    currentTask: "Active recovery workout in Rec & Gym",
    speechBubble: "Reviewing system architecture specs.",
    brief: {
      whoYouAre: "Founder and Lead Architect of EasyUp Software Solution HQ.",
      job: "Orchestrates multi-agent systems, sets architectural invariants, and coordinates leads.",
      mustNeverDo: "Never bypass code review or merge unverified changes to main.",
    },
    allowedTools: ["route_agent", "read_procedural_brain", "review_pull_request", "approve_gate"],
    disallowedTools: ["direct_unvetted_merge"],
  },
  {
    id: "gian",
    name: "Gian",
    department: "Executive",
    role: "Command Coordinator",
    shortRole: "Command Lead",
    modelTier: "opus",
    color: "#06b6d4",
    deskCoordinates: { x: 375, y: 275, z: 0 },
    currentCoordinates: { x: 375, y: 275, z: 0 },
    currentRoom: "brain",
    status: "meeting",
    currentTask: "Coordinating real-time subagent task dispatch at The Brain",
    speechBubble: "Scrum in progress at The Brain.",
    brief: {
      whoYouAre: "HQ Command coordinator overseeing autonomous agent dispatch.",
      job: "Monitors agent queues, handles task routing, and manages all-hands scrums.",
      mustNeverDo: "Never execute irreversible mutations without operator approval.",
    },
    allowedTools: ["dispatch_subagents", "read_brain", "manage_queue"],
    disallowedTools: ["direct_production_mutation"],
  },
  {
    id: "neil-mar",
    name: "Neil Mar ristian",
    department: "Executive",
    role: "Operations Director",
    shortRole: "Ops Director",
    modelTier: "opus",
    color: "#3b82f6",
    deskCoordinates: { x: 425, y: 275, z: 0 },
    currentCoordinates: { x: 425, y: 275, z: 0 },
    currentRoom: "brain",
    status: "meeting",
    currentTask: "Syncing cross-department deliverables at the central holographic orb",
    speechBubble: "Operations nominal across all bays.",
    brief: {
      whoYouAre: "Operations director ensuring continuous workflow synchronization.",
      job: "Ensures compliance with Dual-System Brain operating principles and SLAs.",
      mustNeverDo: "Never disable audit logging or bypass HITL approval gates.",
    },
    allowedTools: ["audit_logs", "read_brain", "sync_workflows"],
    disallowedTools: ["disable_audit_logging"],
  },

  // 2. Focus Work & Systems Design (Purple Bay)
  {
    id: "julian",
    name: "Julian",
    department: "Systems Design",
    role: "Systems Design Specialist [SD]",
    shortRole: "Systems Design",
    modelTier: "opus",
    color: "#a855f7",
    deskCoordinates: { x: 260, y: 155, z: 0 },
    currentCoordinates: { x: 260, y: 155, z: 0 },
    currentRoom: "focus_work",
    status: "working",
    currentTask: "Designing distributed state machine and failure domains for office-v3",
    speechBubble: "Refining domain architecture.",
    brief: {
      whoYouAre: "Systems Design Gatekeeper [SD] enforcing architectural invariants.",
      job: "Defines contracts, SLOs, failure domains, and offline sync boundaries.",
      mustNeverDo: "Never allow unvetted distributed state without idempotency keys.",
    },
    allowedTools: ["architecture_audit", "write_spec", "read_brain"],
    disallowedTools: ["bypass_invariants"],
  },

  // 3. Server Bay & Database / Security (Deep Blue Bay)
  {
    id: "arwin",
    name: "Arwin",
    department: "Database",
    role: "Lead Database Administrator [DB]",
    shortRole: "Lead DBA",
    modelTier: "sonnet",
    color: "#10b981",
    deskCoordinates: { x: 480, y: 120, z: 0 },
    currentCoordinates: { x: 480, y: 120, z: 0 },
    currentRoom: "server_bay",
    status: "working",
    currentTask: "Optimizing PostgreSQL indexing and verifying RLS migration policies",
    speechBubble: "Database cluster healthy.",
    brief: {
      whoYouAre: "DBA Gatekeeper [DB] safeguarding data schemas and append-only logs.",
      job: "Reviews schema migrations, inspects query execution plans, and enforces RLS.",
      mustNeverDo: "Never execute destructive migrations without rollback path.",
    },
    allowedTools: ["inspect_schemas", "run_migrations", "read_brain"],
    disallowedTools: ["destructive_drop_table"],
  },
  {
    id: "nelmar",
    name: "Nelmar",
    department: "Integration",
    role: "Integration & Sync Specialist [IR]",
    shortRole: "Integration",
    modelTier: "sonnet",
    color: "#06b6d4",
    deskCoordinates: { x: 450, y: 155, z: 0 },
    currentCoordinates: { x: 450, y: 155, z: 0 },
    currentRoom: "server_bay",
    status: "working",
    currentTask: "Testing offline sync queues and webhook idempotency contracts",
    speechBubble: "Event stream synced.",
    brief: {
      whoYouAre: "Integration Gatekeeper [IR] connecting external APIs and webhook events.",
      job: "Maintains retry queues, validates payload contracts, and tests idempotency.",
      mustNeverDo: "Never report message delivered without execution receipt.",
    },
    allowedTools: ["verify_webhooks", "queue_dispatcher", "read_brain"],
    disallowedTools: ["unverified_dispatch"],
  },
  {
    id: "john-lloyd",
    name: "John Lloyd",
    department: "Security",
    role: "Cybersecurity & Auth Auditor [SEC]",
    shortRole: "Cybersecurity",
    modelTier: "opus",
    color: "#3b82f6",
    deskCoordinates: { x: 480, y: 190, z: 0 },
    currentCoordinates: { x: 480, y: 190, z: 0 },
    currentRoom: "server_bay",
    status: "working",
    currentTask: "Running automated threat modeling and token boundary verification",
    speechBubble: "Security gates active.",
    brief: {
      whoYouAre: "Security Gatekeeper [SEC] enforcing Zero Trust client/server boundaries.",
      job: "Audits authz rules, verifies secret isolation, and tests RLS bypass cases.",
      mustNeverDo: "Never expose server secrets or bypass permission checks.",
    },
    allowedTools: ["security_audit", "test_rls_bypass", "read_brain"],
    disallowedTools: ["expose_private_keys"],
  },

  // 4. Green Engineering Bay
  {
    id: "blaze",
    name: "Blaze",
    department: "Engineering",
    role: "Full-Stack Dev Lead",
    shortRole: "Dev Lead",
    modelTier: "opus",
    color: "#22c55e",
    deskCoordinates: { x: 550, y: 195, z: 0 },
    currentCoordinates: { x: 550, y: 195, z: 0 },
    currentRoom: "focus_work",
    status: "working",
    currentTask: "Compiling 3D scene shaders and verifying A* pathfinding graph",
    speechBubble: "Shipping new features.",
    brief: {
      whoYouAre: "Core software engineer implementing features in isolated worktrees.",
      job: "Writes modular code, executes test suites, and opens pull requests.",
      mustNeverDo: "Never push directly to main without automated test verification.",
    },
    allowedTools: ["edit_code", "run_tests", "git_worktree"],
    disallowedTools: ["git_push_main"],
  },

  // 5. Gym & Rec Room (Red / Pink Bay)
  {
    id: "john-arvy",
    name: "John Arvy",
    department: "Performance",
    role: "System Health & SRE Specialist",
    shortRole: "SRE Coach",
    modelTier: "sonnet",
    color: "#f43f5e",
    deskCoordinates: { x: 230, y: 330, z: 0 },
    currentCoordinates: { x: 230, y: 330, z: 0 },
    currentRoom: "gym",
    status: "gym",
    currentTask: "Cardio recovery session between load testing iterations",
    speechBubble: "Keeping system stamina high.",
    brief: {
      whoYouAre: "SRE engineer maintaining agent uptime, memory caches, and endurance.",
      job: "Profiles memory consumption, load tests endpoints, and manages system recovery.",
      mustNeverDo: "Never let memory leak without self-healing restart.",
    },
    allowedTools: ["profile_memory", "load_test", "read_brain"],
    disallowedTools: ["ignore_oom"],
  },

  // 6. Pantry & Canteen (Orange Room / All Hands Gathering)
  {
    id: "roy-jhan",
    name: "Roy Jhan",
    department: "Growth",
    role: "Growth & Analytics Lead [GR]",
    shortRole: "Growth Lead",
    modelTier: "sonnet",
    color: "#f97316",
    deskCoordinates: { x: 80, y: 260, z: 0 },
    currentCoordinates: { x: 80, y: 260, z: 0 },
    currentRoom: "pantry",
    status: "eating",
    currentTask: "Coffee break while discussing SEO and user acquisition funnel",
    speechBubble: "Fresh coffee, fresh metrics.",
    brief: {
      whoYouAre: "Growth Agent [GR] driving metrics, search visibility, and adoption.",
      job: "Analyzes retention, tracks conversion funnels, and optimizes distribution.",
      mustNeverDo: "Never publish spammy or unverified marketing content.",
    },
    allowedTools: ["analyze_growth", "read_analytics", "read_brain"],
    disallowedTools: ["spam_campaigns"],
  },
  {
    id: "bonnie",
    name: "Bonnie",
    department: "Design",
    role: "UI/UX Experience Designer [UX]",
    shortRole: "UI/UX Lead",
    modelTier: "sonnet",
    color: "#f59e0b",
    deskCoordinates: { x: 95, y: 275, z: 0 },
    currentCoordinates: { x: 95, y: 275, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Team lunch chat reviewing pixel art color palette tokens",
    speechBubble: "Restrained motion, honest UI.",
    brief: {
      whoYouAre: "UI/UX Gatekeeper [UX] ensuring aesthetic taste and accessibility.",
      job: "Audits contrast, spacing tokens, states (loading, empty, error), and user feedback.",
      mustNeverDo: "Never use fake saves or deceptive dark patterns.",
    },
    allowedTools: ["ui_review", "token_audit", "read_brain"],
    disallowedTools: ["fake_saves"],
  },
  {
    id: "keiru",
    name: "Keiru",
    department: "Research",
    role: "GitHub Radar Researcher",
    shortRole: "Researcher",
    modelTier: "haiku",
    color: "#eab308",
    deskCoordinates: { x: 120, y: 260, z: 0 },
    currentCoordinates: { x: 120, y: 260, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Snack break after scanning 500+ trending AI repositories",
    speechBubble: "Radar scan results look great.",
    brief: {
      whoYouAre: "Open-source intelligence specialist tracking fast-moving AI repos.",
      job: "Runs GitHub trending radar, scores freshness, and summarizes repos.",
      mustNeverDo: "Never alter external repositories.",
    },
    allowedTools: ["radar_scan", "web_fetch", "read_brain"],
    disallowedTools: ["modify_external_repos"],
  },
  {
    id: "mary-grace",
    name: "Mary Grace",
    department: "Documentation",
    role: "Technical Writer & Documentation Specialist",
    shortRole: "Tech Writer",
    modelTier: "sonnet",
    color: "#eab308",
    deskCoordinates: { x: 105, y: 295, z: 0 },
    currentCoordinates: { x: 105, y: 295, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Casual chat about new interactive documentation tutorials",
    speechBubble: "Clear docs build strong teams.",
    brief: {
      whoYouAre: "Documentation architect turning complex code into lucid guides.",
      job: "Maintains API docs, user guides, and architecture specifications.",
      mustNeverDo: "Never publish undocumented API endpoints.",
    },
    allowedTools: ["write_docs", "audit_specs", "read_brain"],
    disallowedTools: ["delete_docs"],
  },
  {
    id: "gabriel",
    name: "Gabriel",
    department: "Commerce",
    role: "TBX Store Operations Manager",
    shortRole: "TBX Shop",
    modelTier: "sonnet",
    color: "#f59e0b",
    deskCoordinates: { x: 145, y: 275, z: 0 },
    currentCoordinates: { x: 145, y: 275, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Hydration break after verifying inventory restock batches",
    speechBubble: "Shop inventory up to date.",
    brief: {
      whoYouAre: "E-commerce merchant handling store inventory, orders, and customer support.",
      job: "Drafts product listings, triages customer orders, and stages returns.",
      mustNeverDo: "Refunds and discounts strictly trigger the HITL gate; never disburse payouts directly.",
    },
    allowedTools: ["query_orders", "stage_refund", "read_brain"],
    disallowedTools: ["direct_refund"],
  },
  {
    id: "ryan",
    name: "Ryan",
    department: "Analytics",
    role: "Telemetry & Data Scientist",
    shortRole: "Analytics",
    modelTier: "haiku",
    color: "#eab308",
    deskCoordinates: { x: 90, y: 310, z: 0 },
    currentCoordinates: { x: 90, y: 310, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Coffee chat comparing daily agent compute utilization",
    speechBubble: "Telemetry indicates peak efficiency.",
    brief: {
      whoYouAre: "Data analyst monitoring real-time agent compute metrics and SLAs.",
      job: "Extracts telemetry insights and creates executive dashboards.",
      mustNeverDo: "Strictly read-only; never alter tracking configurations or schemas.",
    },
    allowedTools: ["read_telemetry", "generate_report", "read_brain"],
    disallowedTools: ["alter_tracking_configs"],
  },
  {
    id: "jo-vincent",
    name: "Jo Vincent",
    department: "Communications",
    role: "Inbound Email & Brand Triager",
    shortRole: "Inbox Lead",
    modelTier: "sonnet",
    color: "#f59e0b",
    deskCoordinates: { x: 135, y: 310, z: 0 },
    currentCoordinates: { x: 135, y: 310, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Afternoon break after filtering 80+ partnership inquiries",
    speechBubble: "Inbox zero reached today.",
    brief: {
      whoYouAre: "Executive correspondence specialist triaging communications.",
      job: "Classifies email inquiries, prepares draft replies, and flags brand deals.",
      mustNeverDo: "Never dispatch outbound email without Human-in-the-Loop review.",
    },
    allowedTools: ["triage_mail", "create_draft", "read_brain"],
    disallowedTools: ["direct_send_mail"],
  },
  {
    id: "khent",
    name: "Khent",
    department: "Creative",
    role: "Remotion Video & Motion Designer",
    shortRole: "Creative Lead",
    modelTier: "sonnet",
    color: "#f59e0b",
    deskCoordinates: { x: 65, y: 290, z: 0 },
    currentCoordinates: { x: 65, y: 290, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Relaxing while video rendering pipeline finishes background exports",
    speechBubble: "Render queue running smoothly.",
    brief: {
      whoYouAre: "Creative director rendering programmatic videos and asset pipelines.",
      job: "Composes Remotion scenes, generates graphics, and validates animations.",
      mustNeverDo: "Never overwrite original raw video footage.",
    },
    allowedTools: ["render_video", "generate_art", "read_brain"],
    disallowedTools: ["overwrite_raw_footage"],
  },
  {
    id: "glor",
    name: "Glor",
    department: "Content",
    role: "Copywriter & Narrative Lead",
    shortRole: "Copy Lead",
    modelTier: "haiku",
    color: "#eab308",
    deskCoordinates: { x: 80, y: 325, z: 0 },
    currentCoordinates: { x: 80, y: 325, z: 0 },
    currentRoom: "pantry",
    status: "break",
    currentTask: "Brainstorming slogans over green tea in the canteen",
    speechBubble: "Words that convert, stories that resonate.",
    brief: {
      whoYouAre: "Creative copywriter shaping brand voice and mission messaging.",
      job: "Writes announcements, video voiceovers, and marketing materials.",
      mustNeverDo: "Never publish without editorial approval.",
    },
    allowedTools: ["write_copy", "read_brain"],
    disallowedTools: ["direct_publish"],
  },

  // 7. Additional Workstation Agents (Bays & Break Area)
  {
    id: "anthony",
    name: "Anthony",
    department: "Product",
    role: "Product Manager [PM]",
    shortRole: "Product Lead",
    modelTier: "opus",
    color: "#a855f7",
    deskCoordinates: { x: 520, y: 340, z: 0 },
    currentCoordinates: { x: 380, y: 260, z: 0 },
    currentRoom: "brain",
    status: "meeting",
    currentTask: "Aligning sprint requirements and scope boundaries at The Brain",
    speechBubble: "Scope cut is the best feature.",
    brief: {
      whoYouAre: "Product Manager Gatekeeper [PM] enforcing spec clarity and scope cut.",
      job: "Validates requirements, cuts non-essential scope, and defines MVP boundaries.",
      mustNeverDo: "Never expand scope without evidence and business justification.",
    },
    allowedTools: ["manage_backlog", "scope_cut", "read_brain"],
    disallowedTools: ["scope_creep"],
  },
  {
    id: "christian",
    name: "Christian",
    department: "Quality",
    role: "Quality Assurance & Test Engineer",
    shortRole: "QA Engineer",
    modelTier: "sonnet",
    color: "#10b981",
    deskCoordinates: { x: 550, y: 340, z: 0 },
    currentCoordinates: { x: 550, y: 340, z: 0 },
    currentRoom: "focus_work",
    status: "break",
    currentTask: "Reviewing edge case scenarios in the scenario bank",
    speechBubble: "Zero regressions in our pipeline.",
    brief: {
      whoYouAre: "QA engineer auditing boundary tests and end-to-end integration flows.",
      job: "Writes automated Vitest suites, tests concurrency, and verifies recovery.",
      mustNeverDo: "Never bypass failing test gates.",
    },
    allowedTools: ["run_tests", "write_test_cases", "read_brain"],
    disallowedTools: ["bypass_failing_tests"],
  },
  {
    id: "ferwi",
    name: "Ferwi",
    department: "DevOps",
    role: "DevOps & Cloud Infrastructure",
    shortRole: "DevOps",
    modelTier: "sonnet",
    color: "#06b6d4",
    deskCoordinates: { x: 440, y: 410, z: 0 },
    currentCoordinates: { x: 440, y: 410, z: 0 },
    currentRoom: "focus_work",
    status: "working",
    currentTask: "Monitoring container health, Vercel deployments, and network proxies",
    speechBubble: "Cloud infra 100% green.",
    brief: {
      whoYouAre: "Infrastructure specialist managing deployment pipelines and proxies.",
      job: "Monitors build health, configures environment boundaries, and prevents outages.",
      mustNeverDo: "Never expose credentials in deployment environments.",
    },
    allowedTools: ["deploy_preview", "inspect_infra", "read_brain"],
    disallowedTools: ["deploy_untested_master"],
  },
  {
    id: "jayson",
    name: "Jayson",
    department: "Support",
    role: "Customer Success & Community Lead",
    shortRole: "Support Lead",
    modelTier: "haiku",
    color: "#f59e0b",
    deskCoordinates: { x: 470, y: 410, z: 0 },
    currentCoordinates: { x: 470, y: 410, z: 0 },
    currentRoom: "focus_work",
    status: "break",
    currentTask: "Reviewing customer feedback threads and feature requests",
    speechBubble: "Community feedback logged.",
    brief: {
      whoYouAre: "Customer advocate tracking user sentiment, issues, and inquiries.",
      job: "Collects bug reports, documents user pain points, and drafts helpful replies.",
      mustNeverDo: "Never disclose unannounced product release dates.",
    },
    allowedTools: ["read_feedback", "draft_reply", "read_brain"],
    disallowedTools: ["leak_roadmap"],
  },
  {
    id: "mark",
    name: "Mark",
    department: "Engineering",
    role: "Frontend Engineer (Next.js & Canvas)",
    shortRole: "Frontend Dev",
    modelTier: "sonnet",
    color: "#3b82f6",
    deskCoordinates: { x: 500, y: 410, z: 0 },
    currentCoordinates: { x: 500, y: 410, z: 0 },
    currentRoom: "focus_work",
    status: "break",
    currentTask: "Taking a quick break after optimizing canvas render frame budget",
    speechBubble: "60 FPS rendering locked in.",
    brief: {
      whoYouAre: "Frontend specialist building accessible React components and canvas layers.",
      job: "Implements responsive views, optimizes bundle size, and maintains pixel aesthetic.",
      mustNeverDo: "Never block the main UI thread with heavy calculations.",
    },
    allowedTools: ["write_frontend", "run_tests", "read_brain"],
    disallowedTools: ["block_event_loop"],
  },
  {
    id: "lance",
    name: "Lance",
    department: "Engineering",
    role: "Backend Engineer (APIs & WebSocket)",
    shortRole: "Backend Dev",
    modelTier: "sonnet",
    color: "#3b82f6",
    deskCoordinates: { x: 530, y: 410, z: 0 },
    currentCoordinates: { x: 530, y: 410, z: 0 },
    currentRoom: "focus_work",
    status: "break",
    currentTask: "Reviewing REST route handler validation schemas",
    speechBubble: "API routes hardened.",
    brief: {
      whoYouAre: "Backend engineer building resilient API routes and state management.",
      job: "Validates input contracts, handles error states, and maintains stores.",
      mustNeverDo: "Never accept unvalidated user payloads.",
    },
    allowedTools: ["write_backend", "run_tests", "read_brain"],
    disallowedTools: ["unvalidated_mutations"],
  },
];

let agentsState: AgentProfile[] = JSON.parse(JSON.stringify(INITIAL_24_AGENTS));

export function getAllAgents(): AgentProfile[] {
  return agentsState;
}

export function getAgentById(id: string): AgentProfile | undefined {
  return agentsState.find((a) => a.id === id);
}

export function updateAgentStatus(
  id: string,
  status: CampusStatus,
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

export type RoutingDestination = "desk" | "pantry" | "gym" | "brain";

export function moveAgentToCoords(id: string, x: number, y: number): AgentProfile {
  const agent = agentsState.find((a) => a.id === id);
  if (!agent) {
    throw new Error(`Agent with id "${id}" not found.`);
  }
  agent.targetCoordinates = { x, y, z: 0 };
  agent.speechBubble = "Moving to coordinates on campus.";
  return agent;
}

export function routeAgent(id: string, destination: RoutingDestination): AgentProfile {
  const agent = agentsState.find((a) => a.id === id);
  if (!agent) {
    throw new Error(`Agent with id "${id}" not found.`);
  }

  switch (destination) {
    case "desk":
      agent.targetCoordinates = { ...agent.deskCoordinates };
      agent.currentRoom = "focus_work";
      agent.status = "working";
      agent.currentTask = `Focused work at assigned desk in ${agent.department}`;
      agent.speechBubble = "Walking to my desk to work.";
      break;

    case "pantry":
      agent.targetCoordinates = { x: 110 + (Math.random() * 40 - 20), y: 280 + (Math.random() * 40 - 20), z: 0 };
      agent.currentRoom = "pantry";
      agent.status = "eating";
      agent.currentTask = "Grabbed a coffee and catching up in Pantry & Canteen";
      agent.speechBubble = "Heading to the pantry for coffee!";
      break;

    case "gym":
      agent.targetCoordinates = { x: 250 + (Math.random() * 30 - 15), y: 350 + (Math.random() * 30 - 15), z: 0 };
      agent.currentRoom = "gym";
      agent.status = "gym";
      agent.currentTask = "Active recovery workout in Rec & Gym";
      agent.speechBubble = "Time for a workout in the gym.";
      break;

    case "brain":
      agent.targetCoordinates = { x: 400 + (Math.random() * 50 - 25), y: 280 + (Math.random() * 50 - 25), z: 0 };
      agent.currentRoom = "brain";
      agent.status = "meeting";
      agent.currentTask = "High-priority all-hands alignment at The Brain";
      agent.speechBubble = "Reporting to The Brain command orb!";
      break;
  }

  return agent;
}

export function updateAgentPositions(delta = 0.08): void {
  for (const agent of agentsState) {
    if (agent.targetCoordinates) {
      const dx = agent.targetCoordinates.x - agent.currentCoordinates.x;
      const dy = agent.targetCoordinates.y - agent.currentCoordinates.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        agent.currentCoordinates.x = agent.targetCoordinates.x;
        agent.currentCoordinates.y = agent.targetCoordinates.y;
        delete agent.targetCoordinates;
      } else {
        agent.currentCoordinates.x += (dx / dist) * Math.min(dist, 4.5);
        agent.currentCoordinates.y += (dy / dist) * Math.min(dist, 4.5);
      }
    }
  }
}

export function getCampusStats(pendingApprovalsCount = 0): CampusStats {
  const total = agentsState.length;
  let working = 0;
  let eating = 0;
  let gym = 0;
  let meeting = 0;
  let breakCount = 0;
  let arriving = 0;

  for (const a of agentsState) {
    if (a.status === "working") working++;
    else if (a.status === "eating") eating++;
    else if (a.status === "gym") gym++;
    else if (a.status === "meeting") meeting++;
    else if (a.status === "break") breakCount++;
    else if (a.status === "arriving") arriving++;
  }

  return {
    total,
    working,
    eating,
    gym,
    meeting,
    breakCount,
    arriving,
    waitingApproval: pendingApprovalsCount,
    openTasks: 8,
    accessories: 13,
  };
}

export function resetAgentState(): void {
  agentsState = JSON.parse(JSON.stringify(INITIAL_24_AGENTS));
}
