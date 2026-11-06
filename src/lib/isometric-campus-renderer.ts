import { AgentProfile, RoomLocation } from "@/types";

export const CAMPUS_WIDTH = 960;
export const CAMPUS_HEIGHT = 640;

export interface CampusRoomBounds {
  name: string;
  type: RoomLocation;
  x: number;
  y: number;
  w: number;
  h: number;
  floorColor: string;
  borderColor: string;
}

export const CAMPUS_ROOMS: CampusRoomBounds[] = [
  // 1. Central Holographic Command (The Brain)
  {
    name: "The Brain // Command Orb",
    type: "brain",
    x: 320,
    y: 200,
    w: 160,
    h: 150,
    floorColor: "#050b14",
    borderColor: "#06b6d4",
  },
  // 2. Focus Work Bay (Purple Room - Top Left)
  {
    name: "Focus Work Bay [SD / UX]",
    type: "focus_work",
    x: 180,
    y: 80,
    w: 160,
    h: 130,
    floorColor: "#2e1065",
    borderColor: "#a855f7",
  },
  // 3. Server Bay & DBA (Deep Blue Room - Top Right)
  {
    name: "Server Bay [DB / SEC / IR]",
    type: "server_bay",
    x: 380,
    y: 60,
    w: 180,
    h: 140,
    floorColor: "#0f172a",
    borderColor: "#3b82f6",
  },
  // 4. Green Engineering Bay (Mid Right)
  {
    name: "Engineering Bay [Dev]",
    type: "focus_work",
    x: 480,
    y: 180,
    w: 170,
    h: 130,
    floorColor: "#052e16",
    borderColor: "#22c55e",
  },
  // 5. Pantry & Canteen (Orange Room - Mid Left)
  {
    name: "Pantry & Canteen // All Hands",
    type: "pantry",
    x: 40,
    y: 220,
    w: 150,
    h: 150,
    floorColor: "#7c2d12",
    borderColor: "#f97316",
  },
  // 6. Rec & Gym (Red / Pink Room - Bottom Left)
  {
    name: "Rec & Gym // Recovery",
    type: "gym",
    x: 180,
    y: 330,
    w: 150,
    h: 140,
    floorColor: "#831843",
    borderColor: "#f43f5e",
  },
  // 7. Magenta Workstation Bay (Bottom Right)
  {
    name: "Workstations & Review Bay",
    type: "focus_work",
    x: 480,
    y: 330,
    w: 170,
    h: 130,
    floorColor: "#701a75",
    borderColor: "#d946ef",
  },
  // 8. Cyan Workstation Bay (Bottom Center)
  {
    name: "Operations & Support Bay",
    type: "focus_work",
    x: 340,
    y: 360,
    w: 130,
    h: 110,
    floorColor: "#083344",
    borderColor: "#06b6d4",
  },
];

export function getAgentAtIsometricCoords(
  x: number,
  y: number,
  agents: AgentProfile[]
): AgentProfile | null {
  for (const agent of agents) {
    const ax = agent.currentCoordinates.x;
    const ay = agent.currentCoordinates.y;
    const dist = Math.sqrt((x - ax) * (x - ax) + (y - ay) * (y - ay));
    if (dist <= 26) {
      return agent;
    }
  }
  return null;
}

export function renderIsometricCampus(
  ctx: CanvasRenderingContext2D,
  agents: AgentProfile[],
  selectedAgentId: string | null,
  hoveredAgentId: string | null,
  tick: number,
  cameraZoom = 1,
  cameraPan = { x: 0, y: 0 }
): void {
  ctx.save();
  ctx.clearRect(0, 0, CAMPUS_WIDTH, CAMPUS_HEIGHT);

  // Apply camera transformation
  ctx.translate(CAMPUS_WIDTH / 2 + cameraPan.x, CAMPUS_HEIGHT / 2 + cameraPan.y);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-CAMPUS_WIDTH / 2, -CAMPUS_HEIGHT / 2);

  // 1. Draw Exterior & Surroundings (Grass Lawn & Road)
  drawExteriorLawnAndRoad(ctx);

  // 2. Draw Building Perimeter and Floor Base
  drawBuildingEnvelope(ctx);

  // 3. Draw All Department Rooms
  for (const room of CAMPUS_ROOMS) {
    drawCampusRoom(ctx, room, tick);
  }

  // 4. Draw Central Holographic Brain Command Center
  drawCentralHolographicBrain(ctx, tick);

  // 5. Draw Furniture (Server racks, desks, gym equipment, canteen tables)
  drawCampusFurniture(ctx, tick);

  // 6. Draw Animated Agents with Name Tags
  for (const agent of agents) {
    drawAgentSprite(
      ctx,
      agent,
      agent.id === selectedAgentId,
      agent.id === hoveredAgentId,
      tick
    );
  }

  ctx.restore();
}

function drawExteriorLawnAndRoad(ctx: CanvasRenderingContext2D): void {
  // Dark lush green campus lawn
  ctx.fillStyle = "#064e3b";
  ctx.fillRect(-200, -200, CAMPUS_WIDTH + 400, CAMPUS_HEIGHT + 400);

  // Trees outside the building
  const treePositions = [
    { x: 100, y: 40 },
    { x: 300, y: 30 },
    { x: 600, y: 40 },
    { x: 740, y: 70 },
    { x: 800, y: 220 },
    { x: 780, y: 380 },
    { x: 40, y: 120 },
    { x: 30, y: 420 },
  ];

  for (const t of treePositions) {
    // Tree Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(t.x + 3, t.y + 4, 18, 0, Math.PI * 2);
    ctx.fill();

    // Tree Foliage
    ctx.fillStyle = "#047857";
    ctx.beginPath();
    ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(t.x - 3, t.y - 3, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  // Asphalt road at bottom front
  ctx.fillStyle = "#18181b";
  ctx.fillRect(-200, 500, CAMPUS_WIDTH + 400, 140);

  // Road curb
  ctx.fillStyle = "#71717a";
  ctx.fillRect(-200, 496, CAMPUS_WIDTH + 400, 4);

  // Yellow road centerline
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 15]);
  ctx.beginPath();
  ctx.moveTo(-200, 560);
  ctx.lineTo(CAMPUS_WIDTH + 200, 560);
  ctx.stroke();
  ctx.setLineDash([]);

  // White zebra pedestrian crossing
  ctx.fillStyle = "#f4f4f5";
  for (let z = 0; z < 6; z++) {
    ctx.fillRect(160 + z * 18, 510, 10, 80);
  }
}

function drawBuildingEnvelope(ctx: CanvasRenderingContext2D): void {
  // Building Shadow
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(25, 45, 680, 440);

  // Main floor foundation
  ctx.fillStyle = "#090d16";
  ctx.fillRect(20, 40, 670, 440);

  // Outer structural concrete walls
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 40, 670, 440);

  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 36, 678, 448);
}

function drawCampusRoom(
  ctx: CanvasRenderingContext2D,
  room: CampusRoomBounds,
  tick: number
): void {
  // Room floor
  ctx.fillStyle = room.floorColor;
  ctx.fillRect(room.x, room.y, room.w, room.h);

  // Interior partition walls
  ctx.strokeStyle = room.borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(room.x, room.y, room.w, room.h);

  // Top header tab with room label
  ctx.fillStyle = `${room.borderColor}33`;
  ctx.fillRect(room.x, room.y, room.w, 14);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 8.5px monospace";
  ctx.fillText(room.name.toUpperCase(), room.x + 5, room.y + 10);
}

function drawCentralHolographicBrain(
  ctx: CanvasRenderingContext2D,
  tick: number
): void {
  const cx = 400;
  const cy = 275;

  // Outer cyan cyber circle
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 65, 0, Math.PI * 2);
  ctx.stroke();

  // Pulsing holographic energy ring
  const pulse = Math.sin(tick * 0.08) * 4;
  ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 + Math.sin(tick * 0.05) * 0.2})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 55 + pulse, 0, Math.PI * 2);
  ctx.stroke();

  // Rotating holographic particle rings (The Brain)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tick * 0.03);

  // Concentric ellipses to mimic 3D sphere
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 10, tick * 0.05, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#06b6d4";
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 22, -tick * 0.04, 0, Math.PI * 2);
  ctx.stroke();

  // Glowing center nucleus
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Circular podium floor
  ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 35, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCampusFurniture(
  ctx: CanvasRenderingContext2D,
  tick: number
): void {
  // 1. Server Racks in Server Bay (Blue Room)
  const serverX = 515;
  const serverY = 70;
  for (let s = 0; s < 3; s++) {
    const sx = serverX + s * 14;
    ctx.fillStyle = "#020617";
    ctx.fillRect(sx, serverY, 12, 30);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, serverY, 12, 30);

    // Blinking server lights
    ctx.fillStyle = tick % 12 < 6 ? "#22c55e" : "#0284c7";
    ctx.fillRect(sx + 2, serverY + 4, 3, 2);
    ctx.fillStyle = tick % 18 < 9 ? "#38bdf8" : "#10b981";
    ctx.fillRect(sx + 7, serverY + 4, 3, 2);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(sx + 2, serverY + 12, 3, 2);
  }

  // 2. Dining Tables in Pantry & Canteen (Orange Room)
  ctx.fillStyle = "#b45309";
  ctx.fillRect(60, 260, 45, 20);
  ctx.fillRect(115, 260, 45, 20);
  ctx.fillStyle = "#78350f";
  ctx.fillRect(62, 262, 41, 16);
  ctx.fillRect(117, 262, 41, 16);

  // Coffee Machine & Water Dispenser
  ctx.fillStyle = "#334155";
  ctx.fillRect(45, 335, 16, 22);
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(47, 337, 12, 10);

  // 3. Treadmills in Rec & Gym (Red Room)
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(195, 395, 28, 14);
  ctx.fillRect(235, 395, 28, 14);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(197, 397, 24, 10);
  ctx.fillRect(237, 397, 24, 10);

  // Workout mats (cyan and magenta mats)
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(200, 360, 24, 14);
  ctx.fillStyle = "#ec4899";
  ctx.fillRect(235, 360, 24, 14);

  // 4. Computer desks in Focus & Dev bays
  const desks = [
    { x: 230, y: 130 },
    { x: 280, y: 130 },
    { x: 230, y: 175 },
    { x: 280, y: 175 },
    { x: 420, y: 130 },
    { x: 420, y: 170 },
    { x: 520, y: 220 },
    { x: 580, y: 220 },
    { x: 520, y: 260 },
    { x: 580, y: 260 },
  ];

  for (const d of desks) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(d.x - 14, d.y - 6, 28, 14);
    ctx.fillStyle = "#334155";
    ctx.fillRect(d.x - 7, d.y - 4, 14, 8);
    // Glowing screen
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(d.x - 6, d.y - 3, 12, 6);
  }
}

function drawAgentSprite(
  ctx: CanvasRenderingContext2D,
  agent: AgentProfile,
  isSelected: boolean,
  isHovered: boolean,
  tick: number
): void {
  const { x, y } = agent.currentCoordinates;

  // Selection / Hover Target Reticle
  if (isSelected || isHovered) {
    ctx.strokeStyle = isSelected ? "#38bdf8" : "#94a3b8";
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.beginPath();
    ctx.arc(x, y + 2, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating selector brackets if selected
    if (isSelected) {
      ctx.save();
      ctx.translate(x, y + 2);
      ctx.rotate(tick * 0.05);
      ctx.strokeStyle = "#06b6d4";
      ctx.strokeRect(-18, -18, 36, 36);
      ctx.restore();
    }
  }

  // Ground contact shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 8, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walking or breathing bob
  const isWalking = !!agent.targetCoordinates;
  const bob = isWalking ? Math.sin(tick * 0.4) * 2 : Math.sin(tick * 0.06) * 1;
  const cy = y + bob;

  // Body / Outfit
  ctx.fillStyle = agent.color;
  ctx.fillRect(x - 5, cy - 2, 10, 9);

  // Head
  ctx.fillStyle = "#fed7aa"; // Peach skin tone
  ctx.fillRect(x - 4, cy - 10, 8, 8);

  // Hair
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(x - 5, cy - 12, 10, 4);

  // Status-colored badge above head
  let statusBadgeColor = "#22c55e"; // working
  if (agent.status === "eating") statusBadgeColor = "#f97316";
  else if (agent.status === "gym") statusBadgeColor = "#38bdf8";
  else if (agent.status === "meeting") statusBadgeColor = "#d946ef";
  else if (agent.status === "break") statusBadgeColor = "#eab308";
  else if (agent.status === "waiting_approval") statusBadgeColor = "#ef4444";

  // Name Tag Bubble (matches screenshot: "• Julian", "• Blaze", etc.)
  ctx.font = "bold 9px monospace";
  const nameText = `● ${agent.name}`;
  const textWidth = ctx.measureText(nameText).width;
  const tagW = textWidth + 10;
  const tagH = 15;
  const tagX = x - tagW / 2;
  const tagY = cy - 26;

  // Tag background
  ctx.fillStyle = isSelected ? "#0284c7" : "rgba(15, 23, 42, 0.9)";
  ctx.strokeStyle = isSelected ? "#38bdf8" : "#334155";
  ctx.lineWidth = 1;
  ctx.fillRect(tagX, tagY, tagW, tagH);
  ctx.strokeRect(tagX, tagY, tagW, tagH);

  // Status dot
  ctx.fillStyle = statusBadgeColor;
  ctx.fillText("●", tagX + 4, tagY + 11);

  // Name text
  ctx.fillStyle = isSelected ? "#ffffff" : "#f1f5f9";
  ctx.fillText(agent.name, tagX + 13, tagY + 11);
}

