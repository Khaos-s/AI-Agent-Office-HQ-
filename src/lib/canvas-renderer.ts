import { AgentProfile } from "@/types";

export const OFFICE_WIDTH = 800;
export const OFFICE_HEIGHT = 520;
const HIT_RADIUS = 35;

export interface ZoneConfig {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  departmentId: string;
}

export const OFFICE_ZONES: ZoneConfig[] = [
  { name: "Executive Suite", x: 260, y: 30, w: 180, h: 110, accent: "#6366f1", departmentId: "lead" },
  { name: "Research Lab", x: 30, y: 100, w: 180, h: 110, accent: "#0ea5e9", departmentId: "research" },
  { name: "Scripting Desk", x: 30, y: 230, w: 180, h: 110, accent: "#10b981", departmentId: "scripts" },
  { name: "Social Staging", x: 30, y: 360, w: 180, h: 110, accent: "#ec4899", departmentId: "social" },
  { name: "Creative Studio", x: 260, y: 200, w: 180, h: 120, accent: "#f43f5e", departmentId: "creative" },
  { name: "Analytics Bay", x: 260, y: 360, w: 180, h: 110, accent: "#f59e0b", departmentId: "analytics" },
  { name: "Inbox Desk", x: 490, y: 100, w: 180, h: 110, accent: "#14b8a6", departmentId: "inbox" },
  { name: "Dev Worktrees", x: 490, y: 230, w: 180, h: 110, accent: "#3b82f6", departmentId: "dev" },
  { name: "TBX Shop Ops", x: 490, y: 360, w: 180, h: 110, accent: "#8b5cf6", departmentId: "tbx-shop" },
];

export function getAgentAtCoordinates(
  x: number,
  y: number,
  agents: AgentProfile[]
): AgentProfile | null {
  for (const agent of agents) {
    const dx = x - agent.deskCoordinates.x;
    const dy = y - agent.deskCoordinates.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= HIT_RADIUS) {
      return agent;
    }
  }
  return null;
}

export function renderOffice(
  ctx: CanvasRenderingContext2D,
  agents: AgentProfile[],
  selectedAgentId: string | null,
  hoveredAgentId: string | null,
  tick: number
): void {
  // Clear background (dark office floor)
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, OFFICE_WIDTH, OFFICE_HEIGHT);

  // Draw floor grid pattern (carpet tiles)
  ctx.strokeStyle = "#162032";
  ctx.lineWidth = 1;
  const tileSize = 20;
  for (let x = 0; x < OFFICE_WIDTH; x += tileSize) {
    for (let y = 0; y < OFFICE_HEIGHT; y += tileSize) {
      if ((x / tileSize + y / tileSize) % 2 === 0) {
        ctx.fillStyle = "#0c1322";
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  // Draw walls / border
  ctx.strokeStyle = "#27354f";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, OFFICE_WIDTH - 20, OFFICE_HEIGHT - 20);

  // Draw department zones
  for (const zone of OFFICE_ZONES) {
    const isHovered = hoveredAgentId === zone.departmentId;
    const isSelected = selectedAgentId === zone.departmentId;

    // Carpet fill
    ctx.fillStyle = isSelected
      ? `${zone.accent}33`
      : isHovered
      ? `${zone.accent}22`
      : "#11182788";
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);

    // Border
    ctx.strokeStyle = isSelected ? zone.accent : isHovered ? `${zone.accent}aa` : "#374151";
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);

    // Zone Title Tab
    ctx.fillStyle = isSelected ? zone.accent : "#1e293b";
    ctx.fillRect(zone.x, zone.y, zone.w, 18);
    ctx.fillStyle = isSelected ? "#ffffff" : "#94a3b8";
    ctx.font = "bold 10px monospace";
    ctx.fillText(zone.name.toUpperCase(), zone.x + 6, zone.y + 13);
  }

  // Draw Water Cooler / Coffee Station
  drawDecorations(ctx, tick);

  // Draw desks and agents
  for (const agent of agents) {
    drawDeskAndAgent(
      ctx,
      agent,
      selectedAgentId === agent.id,
      hoveredAgentId === agent.id,
      tick
    );
  }

  // Draw speech bubbles for active/selected agents (drawn after to stay on top)
  for (const agent of agents) {
    if (
      agent.speechBubble &&
      (agent.status === "awaiting_approval" ||
        agent.status === "working" ||
        selectedAgentId === agent.id)
    ) {
      drawSpeechBubble(ctx, agent, tick);
    }
  }
}

function drawDecorations(ctx: CanvasRenderingContext2D, tick: number): void {
  // Water cooler at center top right
  const wx = 445;
  const wy = 50;
  ctx.fillStyle = "#334155";
  ctx.fillRect(wx, wy + 15, 16, 20);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(wx + 2, wy + 2, 12, 14);

  // Plants at corners
  drawPlant(ctx, 22, 22);
  drawPlant(ctx, OFFICE_WIDTH - 38, 22);
  drawPlant(ctx, 22, OFFICE_HEIGHT - 40);
  drawPlant(ctx, OFFICE_WIDTH - 38, OFFICE_HEIGHT - 40);
}

function drawPlant(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Pot
  ctx.fillStyle = "#78350f";
  ctx.fillRect(x + 3, y + 10, 10, 8);
  // Leaves
  ctx.fillStyle = "#10b981";
  ctx.fillRect(x + 1, y + 4, 6, 6);
  ctx.fillRect(x + 9, y + 4, 6, 6);
  ctx.fillRect(x + 5, y + 1, 6, 6);
}

function drawDeskAndAgent(
  ctx: CanvasRenderingContext2D,
  agent: AgentProfile,
  isSelected: boolean,
  isHovered: boolean,
  tick: number
): void {
  const { x, y } = agent.deskCoordinates;

  // Selection highlight halo
  if (isSelected || isHovered) {
    ctx.strokeStyle = isSelected ? "#38bdf8" : "#94a3b8";
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 1. Wooden Desk
  ctx.fillStyle = "#3e2723";
  ctx.fillRect(x - 24, y - 8, 48, 24);
  ctx.fillStyle = "#4e342e";
  ctx.fillRect(x - 22, y - 6, 44, 20);

  // 2. Computer Monitor & Stand
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(x - 12, y - 4, 24, 14);

  // Glowing Screen color based on status
  let screenColor = "#334155";
  if (agent.status === "working") {
    screenColor = tick % 20 < 10 ? "#10b981" : "#059669";
  } else if (agent.status === "thinking") {
    screenColor = tick % 15 < 7 ? "#38bdf8" : "#0284c7";
  } else if (agent.status === "awaiting_approval") {
    screenColor = tick % 10 < 5 ? "#f59e0b" : "#b45309";
  } else if (agent.status === "error") {
    screenColor = "#ef4444";
  }

  ctx.fillStyle = screenColor;
  ctx.fillRect(x - 10, y - 2, 20, 10);

  // Keyboard
  ctx.fillStyle = "#64748b";
  ctx.fillRect(x - 8, y + 10, 16, 4);

  // Coffee mug
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(x + 14, y + 4, 4, 5);

  // 3. Agent Character Sprite (seated above desk facing forward/screen)
  const bob = agent.status === "working" ? Math.sin(tick * 0.2) * 1.5 : Math.sin(tick * 0.05) * 1;
  const cy = y - 22 + bob;

  // Shadow under chair
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(x, y - 10, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chair Back
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(x - 12, cy - 2, 24, 18);

  // Body / Shirt (colored by department)
  ctx.fillStyle = agent.color;
  ctx.fillRect(x - 9, cy + 4, 18, 12);

  // Head / Face
  ctx.fillStyle = "#fed7aa"; // Peach skin
  ctx.fillRect(x - 7, cy - 8, 14, 12);

  // Hair
  ctx.fillStyle = "#1c1917";
  ctx.fillRect(x - 8, cy - 11, 16, 5);
  ctx.fillRect(x - 8, cy - 8, 3, 5);

  // Eyes (looking down at screen)
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(x - 4, cy - 3, 2, 2);
  ctx.fillRect(x + 2, cy - 3, 2, 2);

  // 4. Status Indicator Badge Above Head
  drawStatusBadge(ctx, agent, x, cy - 16, tick);
}

function drawStatusBadge(
  ctx: CanvasRenderingContext2D,
  agent: AgentProfile,
  x: number,
  y: number,
  tick: number
): void {
  if (agent.status === "awaiting_approval") {
    // Pulsing warning diamond
    const pulse = Math.sin(tick * 0.3) * 2;
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(x, y + pulse, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 9px monospace";
    ctx.fillText("!", x - 2, y + 3 + pulse);
  } else if (agent.status === "working") {
    // Green gear / pulse dot
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (agent.status === "thinking") {
    // Blue sparkles
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  agent: AgentProfile,
  tick: number
): void {
  const { x, y } = agent.deskCoordinates;
  const text = agent.speechBubble || agent.currentTask || "";
  const bubbleY = y - 48;

  ctx.font = "10px monospace";
  const metrics = ctx.measureText(text);
  const textWidth = Math.min(metrics.width, 160);
  const bubbleWidth = textWidth + 14;
  const bubbleHeight = 22;
  const bx = x - bubbleWidth / 2;

  // Background
  ctx.fillStyle = agent.status === "awaiting_approval" ? "#78350f" : "#1e293b";
  ctx.strokeStyle = agent.status === "awaiting_approval" ? "#f59e0b" : agent.color;
  ctx.lineWidth = 1;

  ctx.fillRect(bx, bubbleY, bubbleWidth, bubbleHeight);
  ctx.strokeRect(bx, bubbleY, bubbleWidth, bubbleHeight);

  // Pointer triangle
  ctx.beginPath();
  ctx.moveTo(x - 4, bubbleY + bubbleHeight);
  ctx.lineTo(x, bubbleY + bubbleHeight + 5);
  ctx.lineTo(x + 4, bubbleY + bubbleHeight);
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.fillStyle = "#f8fafc";
  ctx.fillText(
    text.length > 22 ? `${text.substring(0, 20)}...` : text,
    bx + 7,
    bubbleY + 14
  );
}

