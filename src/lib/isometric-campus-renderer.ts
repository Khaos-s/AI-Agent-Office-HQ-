import { AgentProfile, RoomLocation } from "@/types";

export const CAMPUS_WIDTH = 960;
export const CAMPUS_HEIGHT = 640;

export interface IsometricRoom {
  id: string;
  name: string;
  type: RoomLocation;
  // Floor polygon in screen space
  points: { x: number; y: number }[];
  floorColor: string;
  floorColorAlt?: string;
  borderColor: string;
  labelPoint: { x: number; y: number };
}

// Room definitions matching the exact diamond layout of the screenshot
export const ISOMETRIC_ROOMS: IsometricRoom[] = [
  // 1. Focus Work Bay (Purple floor - Top Left / North-West)
  {
    id: "focus_work",
    name: "Focus Work Bay [SD / UX]",
    type: "focus_work",
    points: [
      { x: 370, y: 55 },
      { x: 190, y: 155 },
      { x: 300, y: 220 },
      { x: 400, y: 150 },
    ],
    floorColor: "#2e1065",
    borderColor: "#a855f7",
    labelPoint: { x: 260, y: 95 },
  },
  // 2. Server Bay & DBA (Deep Blue floor - Top Right / North-East)
  {
    id: "server_bay",
    name: "Server Bay [DB / SEC / IR]",
    type: "server_bay",
    points: [
      { x: 370, y: 55 },
      { x: 400, y: 150 },
      { x: 530, y: 220 },
      { x: 675, y: 135 },
    ],
    floorColor: "#0f172a",
    borderColor: "#3b82f6",
    labelPoint: { x: 480, y: 90 },
  },
  // 3. Central Holographic Brain (Center / Black Cyber Dais)
  {
    id: "brain",
    name: "The Brain // Command Orb",
    type: "brain",
    points: [
      { x: 400, y: 200 },
      { x: 460, y: 245 },
      { x: 460, y: 310 },
      { x: 400, y: 350 },
      { x: 340, y: 310 },
      { x: 340, y: 245 },
    ],
    floorColor: "#050b14",
    borderColor: "#06b6d4",
    labelPoint: { x: 400, y: 220 },
  },
  // 4. Engineering Bay (Green floor - Mid Right / East)
  {
    id: "engineering",
    name: "Engineering Bay [Dev Lead]",
    type: "focus_work",
    points: [
      { x: 530, y: 220 },
      { x: 460, y: 275 },
      { x: 545, y: 335 },
      { x: 675, y: 245 },
    ],
    floorColor: "#052e16",
    borderColor: "#22c55e",
    labelPoint: { x: 570, y: 250 },
  },
  // 5. Workstations & Review Bay (Magenta floor - Bottom Right / South-East)
  {
    id: "workstations",
    name: "Workstations & Review Bay",
    type: "focus_work",
    points: [
      { x: 460, y: 310 },
      { x: 545, y: 335 },
      { x: 675, y: 245 },
      { x: 675, y: 350 },
      { x: 485, y: 460 },
      { x: 420, y: 410 },
    ],
    floorColor: "#4a044e",
    borderColor: "#d946ef",
    labelPoint: { x: 560, y: 380 },
  },
  // 6. Pantry & Canteen (Warm Orange floor - Mid Left / West)
  {
    id: "pantry",
    name: "Pantry & Canteen // All Hands",
    type: "pantry",
    points: [
      { x: 190, y: 155 },
      { x: 45, y: 240 },
      { x: 175, y: 345 },
      { x: 300, y: 220 },
    ],
    floorColor: "#7c2d12",
    borderColor: "#f97316",
    labelPoint: { x: 130, y: 235 },
  },
  // 7. Rec & Gym (Bright Red/Pink floor - Bottom Left / South-West)
  {
    id: "gym",
    name: "Rec & Gym // Recovery",
    type: "gym",
    points: [
      { x: 175, y: 345 },
      { x: 45, y: 420 },
      { x: 280, y: 480 },
      { x: 340, y: 350 },
    ],
    floorColor: "#831843",
    borderColor: "#f43f5e",
    labelPoint: { x: 210, y: 420 },
  },
  // 8. Operations Bay (Teal floor - Bottom Center)
  {
    id: "operations",
    name: "Operations & Support Bay",
    type: "focus_work",
    points: [
      { x: 340, y: 350 },
      { x: 420, y: 410 },
      { x: 375, y: 490 },
      { x: 280, y: 480 },
    ],
    floorColor: "#083344",
    borderColor: "#06b6d4",
    labelPoint: { x: 350, y: 440 },
  },
];

// Desk positions for rendering isometric workstations
export interface IsometricDesk {
  x: number;
  y: number;
  rotation: "left" | "right";
  hasMonitors: boolean;
}

export const CAMPUS_DESKS: IsometricDesk[] = [
  // Focus Work (Purple - Julian & Bonnie)
  { x: 260, y: 165, rotation: "left", hasMonitors: true },
  { x: 310, y: 150, rotation: "left", hasMonitors: true },

  // Server Bay (Blue - Arwin, Nelmar, John Lloyd)
  { x: 480, y: 130, rotation: "right", hasMonitors: true },
  { x: 450, y: 170, rotation: "right", hasMonitors: true },
  { x: 520, y: 175, rotation: "right", hasMonitors: true },

  // Engineering Bay (Green - Blaze, Mark, Lance, Christian)
  { x: 550, y: 245, rotation: "right", hasMonitors: true },
  { x: 600, y: 255, rotation: "right", hasMonitors: true },
  { x: 565, y: 290, rotation: "right", hasMonitors: true },
  { x: 615, y: 295, rotation: "right", hasMonitors: true },

  // Operations & Cloud Bay (Magenta - Ferwi, Jayson, Jo Vincent, Gabriel)
  { x: 470, y: 365, rotation: "right", hasMonitors: true },
  { x: 520, y: 375, rotation: "right", hasMonitors: true },
  { x: 570, y: 385, rotation: "right", hasMonitors: true },
  { x: 620, y: 345, rotation: "right", hasMonitors: true },

  // Research & Analytics Bay (Teal - Keiru, Ryan, Mary Grace, Glor)
  { x: 320, y: 430, rotation: "left", hasMonitors: true },
  { x: 365, y: 430, rotation: "left", hasMonitors: true },
  { x: 330, y: 465, rotation: "left", hasMonitors: true },
  { x: 375, y: 465, rotation: "left", hasMonitors: true },
];

export interface RippleEffect {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

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

export function getRoomAtIsometricCoords(x: number, y: number): IsometricRoom | null {
  for (const room of ISOMETRIC_ROOMS) {
    if (isPointInPolygon({ x, y }, room.points)) {
      return room;
    }
  }
  return null;
}

function isPointInPolygon(
  point: { x: number; y: number },
  vs: { x: number; y: number }[]
): boolean {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x;
    const yi = vs[i].y;
    const xj = vs[j].x;
    const yj = vs[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function renderIsometricCampus(
  ctx: CanvasRenderingContext2D,
  agents: AgentProfile[],
  selectedAgentId: string | null,
  hoveredAgentId: string | null,
  tick: number,
  cameraZoom = 1,
  cameraPan = { x: 0, y: 0 },
  activeRipples: RippleEffect[] = [],
  canvasW = CAMPUS_WIDTH,
  canvasH = CAMPUS_HEIGHT,
): void {
  ctx.save();
  ctx.clearRect(0, 0, canvasW, canvasH);

  // Apply camera transformation — pivot around canvas centre, then pan
  ctx.translate(canvasW / 2 + cameraPan.x, canvasH / 2 + cameraPan.y);
  ctx.scale(cameraZoom, cameraZoom);
  // Offset so the campus (designed around CAMPUS_WIDTH×CAMPUS_HEIGHT) is centred
  ctx.translate(-CAMPUS_WIDTH / 2, -CAMPUS_HEIGHT / 2);

  // 1. Draw Exterior & Surroundings (Lush dark lawn, road, crossing, trees)
  drawExteriorLawnAndRoad(ctx, tick);

  // 2. Draw Building Envelope & Foundation
  drawBuildingEnvelope(ctx);

  // 3. Draw All Room Floors
  for (const room of ISOMETRIC_ROOMS) {
    drawRoomFloor(ctx, room, tick);
  }

  // 4. Draw Central Holographic Brain Platform & Rotating Orb
  drawCentralHolographicBrain(ctx, tick);

  // 5. Draw Isometric Interior Walls & Partitions
  drawIsometricWalls(ctx);

  // 6. Draw Furniture (desks with glowing dual monitors, server racks, treadmills, mats, tables)
  drawCampusFurniture(ctx, tick);

  // 7. Draw Click Ripples
  drawClickRipples(ctx, activeRipples);

  // 8. Draw Animated Agents & Floating Name Tags
  // Sort agents by Y coordinate for correct isometric depth layering
  const sortedAgents = [...agents].sort(
    (a, b) => a.currentCoordinates.y - b.currentCoordinates.y
  );

  for (const agent of sortedAgents) {
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

function drawExteriorLawnAndRoad(ctx: CanvasRenderingContext2D, tick: number): void {
  // Dark lush teal lawn covering entire canvas
  ctx.fillStyle = "#022c22";
  ctx.fillRect(-2000, -2000, 6000, 6000);

  // Subtle grid texture on ground
  ctx.strokeStyle = "rgba(4, 120, 87, 0.12)";
  ctx.lineWidth = 1;
  const gridSize = 30;
  for (let x = -2000; x < 4000; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, -2000);
    ctx.lineTo(x, 4000);
    ctx.stroke();
  }
  for (let y = -2000; y < 4000; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(-2000, y);
    ctx.lineTo(4000, y);
    ctx.stroke();
  }

  // Stylized Isometric Trees
  const trees = [
    { x: 300, y: 110, size: 26 },
    { x: 580, y: 110, size: 26 },
    { x: 740, y: 170, size: 28 },
    { x: 780, y: 310, size: 28 },
    { x: 60, y: 160, size: 26 },
    { x: 35, y: 350, size: 28 },
    { x: 45, y: 480, size: 26 },
  ];

  for (const tree of trees) {
    // Tree ground shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(tree.x + 4, tree.y + 8, tree.size * 0.8, tree.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tree trunk
    ctx.fillStyle = "#78350f";
    ctx.fillRect(tree.x - 3, tree.y - 4, 6, 12);

    // Tree foliage - tiered emerald spheres
    ctx.fillStyle = "#047857";
    ctx.beginPath();
    ctx.arc(tree.x, tree.y - 12, tree.size * 0.75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#059669";
    ctx.beginPath();
    ctx.arc(tree.x - 2, tree.y - 16, tree.size * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(tree.x - 4, tree.y - 20, tree.size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Asphalt road running along the bottom-left isometric edge
  ctx.save();
  // Draw diagonal road polygon
  ctx.fillStyle = "#18181b";
  ctx.beginPath();
  ctx.moveTo(-100, 380);
  ctx.lineTo(340, 680);
  ctx.lineTo(260, 720);
  ctx.lineTo(-180, 420);
  ctx.closePath();
  ctx.fill();

  // Road curb
  ctx.strokeStyle = "#52525b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-100, 380);
  ctx.lineTo(340, 680);
  ctx.stroke();

  // Yellow dashed road centerline
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 12]);
  ctx.beginPath();
  ctx.moveTo(-140, 400);
  ctx.lineTo(300, 700);
  ctx.stroke();
  ctx.setLineDash([]);

  // White zebra pedestrian crossing stripes
  ctx.fillStyle = "#f4f4f5";
  for (let z = 0; z < 7; z++) {
    const ox = 110 + z * 16;
    const oy = 525 + z * 11;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox - 30, oy + 20);
    ctx.lineTo(ox - 22, oy + 26);
    ctx.lineTo(ox + 8, oy + 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawBuildingEnvelope(ctx: CanvasRenderingContext2D): void {
  // Ground shadow of entire building
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.beginPath();
  ctx.moveTo(370, 75);
  ctx.lineTo(690, 255);
  ctx.lineTo(495, 475);
  ctx.lineTo(365, 505);
  ctx.lineTo(35, 435);
  ctx.lineTo(35, 255);
  ctx.closePath();
  ctx.fill();

  // Base concrete foundation
  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.moveTo(370, 50);
  ctx.lineTo(680, 240);
  ctx.lineTo(485, 465);
  ctx.lineTo(355, 495);
  ctx.lineTo(40, 425);
  ctx.lineTo(40, 235);
  ctx.closePath();
  ctx.fill();
}

function drawRoomFloor(
  ctx: CanvasRenderingContext2D,
  room: IsometricRoom,
  tick: number
): void {
  const pts = room.points;
  if (pts.length < 3) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.closePath();

  // Floor fill
  ctx.fillStyle = room.floorColor;
  ctx.fill();

  // Subtle isometric tile line accents
  ctx.strokeStyle = `${room.borderColor}33`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Highlight border
  ctx.strokeStyle = `${room.borderColor}99`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

function drawIsometricWalls(ctx: CanvasRenderingContext2D): void {
  const wallHeight = 24;

  // Exterior wall segments with 3D height
  const outerSegments = [
    // Top-Left exterior wall
    { from: { x: 370, y: 55 }, to: { x: 45, y: 240 } },
    // Top-Right exterior wall
    { from: { x: 370, y: 55 }, to: { x: 675, y: 135 } },
    { from: { x: 675, y: 135 }, to: { x: 675, y: 350 } },
    // Bottom-Left exterior wall
    { from: { x: 45, y: 240 }, to: { x: 45, y: 420 } },
    { from: { x: 45, y: 420 }, to: { x: 280, y: 480 } },
    // Bottom-Right exterior wall
    { from: { x: 675, y: 350 }, to: { x: 485, y: 460 } },
    { from: { x: 485, y: 460 }, to: { x: 375, y: 490 } },
    { from: { x: 375, y: 490 }, to: { x: 280, y: 480 } },
  ];

  ctx.save();
  for (const seg of outerSegments) {
    // Wall side panel
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(seg.from.x, seg.from.y);
    ctx.lineTo(seg.to.x, seg.to.y);
    ctx.lineTo(seg.to.x, seg.to.y - wallHeight);
    ctx.lineTo(seg.from.x, seg.from.y - wallHeight);
    ctx.closePath();
    ctx.fill();

    // Wall cap
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(seg.from.x, seg.from.y - wallHeight);
    ctx.lineTo(seg.to.x, seg.to.y - wallHeight);
    ctx.stroke();
  }

  // Interior partition walls with glass tint
  const interiorWalls = [
    // Divider between Purple and Blue rooms
    { from: { x: 370, y: 55 }, to: { x: 400, y: 150 } },
    // Divider along pantry
    { from: { x: 190, y: 155 }, to: { x: 300, y: 220 } },
    // Divider along server bay
    { from: { x: 400, y: 150 }, to: { x: 530, y: 220 } },
    // Divider between Gym and Operations
    { from: { x: 280, y: 480 }, to: { x: 340, y: 350 } },
    // Divider between Operations and Workstations
    { from: { x: 375, y: 490 }, to: { x: 420, y: 410 } },
  ];

  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  ctx.lineWidth = 1.5;

  for (const wall of interiorWalls) {
    ctx.beginPath();
    ctx.moveTo(wall.from.x, wall.from.y);
    ctx.lineTo(wall.to.x, wall.to.y);
    ctx.lineTo(wall.to.x, wall.to.y - 18);
    ctx.lineTo(wall.from.x, wall.from.y - 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawCentralHolographicBrain(
  ctx: CanvasRenderingContext2D,
  tick: number
): void {
  const cx = 400;
  const cy = 275;

  ctx.save();

  // 1. Central Cyber Dais Platform (Dark Blue / Black Circle)
  ctx.fillStyle = "#030712";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 75, 46, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Outer glowing cyan circular border
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 75, 46, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Concentric pulsing cyan energy rings
  const pulse = Math.sin(tick * 0.08) * 3;
  ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 + Math.sin(tick * 0.05) * 0.25})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 62 + pulse, 38 + pulse * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring with rotating tick markers
  ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 46, 28, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Circular meeting desk around the orb
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 54, 33, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Central Holographic Rotating Sphere (Wireframe Orb)
  const orbY = cy - 14;
  ctx.translate(cx, orbY);

  // Rotating outer energy rings
  const rot = tick * 0.035;
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 12, rot, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#06b6d4";
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 24, -rot * 0.8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#67e8f9";
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 18, rot * 1.2, 0, Math.PI * 2);
  ctx.stroke();

  // Glowing white nuclear core
  const coreGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 14);
  coreGlow.addColorStop(0, "#ffffff");
  coreGlow.addColorStop(0.4, "#38bdf8");
  coreGlow.addColorStop(1, "rgba(6, 182, 212, 0)");
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCampusFurniture(
  ctx: CanvasRenderingContext2D,
  tick: number
): void {
  ctx.save();

  // 1. Server Racks in Server Bay (Top-Right / Blue Room)
  // Matching screenshot: 3 tall vertical server towers against the back wall
  const serverX = 490;
  const serverY = 82;
  for (let s = 0; s < 3; s++) {
    const sx = serverX + s * 16;
    const sy = serverY + s * 9;

    // Tower base & body
    ctx.fillStyle = "#020617";
    ctx.fillRect(sx, sy, 14, 28);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx, sy, 14, 28);

    // Blinking LED status lights
    ctx.fillStyle = tick % 14 < 7 ? "#22c55e" : "#0284c7";
    ctx.fillRect(sx + 2, sy + 4, 3, 2);
    ctx.fillStyle = tick % 20 < 10 ? "#38bdf8" : "#10b981";
    ctx.fillRect(sx + 8, sy + 4, 3, 2);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(sx + 2, sy + 12, 3, 2);
    ctx.fillStyle = tick % 16 < 8 ? "#38bdf8" : "#22c55e";
    ctx.fillRect(sx + 8, sy + 12, 3, 2);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(sx + 2, sy + 20, 3, 2);
  }

  // Whiteboard / Architecture Board on back wall of Server Bay
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(545, 115, 30, 16);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.strokeRect(545, 115, 30, 16);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(548, 118, 12, 2);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(548, 123, 18, 2);

  // Large UI Screen in Focus Work Bay (Purple Room)
  ctx.fillStyle = "#1e1b4b";
  ctx.fillRect(205, 120, 28, 16);
  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 1;
  ctx.strokeRect(205, 120, 28, 16);
  ctx.fillStyle = "#c084fc";
  ctx.fillRect(208, 123, 14, 2);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(208, 127, 20, 2);

  // 2. Dining Tables in Pantry & Canteen (Warm Orange Room)
  ctx.fillStyle = "#b45309";
  // Long table 1
  ctx.fillRect(75, 270, 48, 16);
  ctx.fillStyle = "#78350f";
  ctx.fillRect(77, 272, 44, 12);
  // Coffee mugs & plates
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(82, 274, 3, 3);
  ctx.fillRect(98, 276, 4, 4);
  ctx.fillRect(112, 274, 3, 3);

  // Table 2
  ctx.fillStyle = "#b45309";
  ctx.fillRect(130, 270, 42, 16);
  ctx.fillStyle = "#78350f";
  ctx.fillRect(132, 272, 38, 12);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(138, 274, 4, 4);
  ctx.fillRect(156, 274, 3, 3);

  // Water Cooler / Dispenser
  ctx.fillStyle = "#334155";
  ctx.fillRect(205, 310, 14, 22);
  // Transparent cyan water bottle on top
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(207, 302, 10, 10);

  // 3. Treadmills in Rec & Gym (Red/Pink Room)
  // Treadmill 1
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(285, 410, 24, 12);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(287, 412, 20, 8);
  // Console
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(305, 408, 3, 6);

  // Treadmill 2
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(320, 425, 24, 12);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(322, 427, 20, 8);
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(340, 423, 3, 6);

  // Workout Yoga Mats (Cyan & Pink mats matching screenshot)
  // Cyan mat
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(245, 370, 26, 12);
  // Hot pink mat
  ctx.fillStyle = "#ec4899";
  ctx.fillRect(278, 375, 26, 12);

  // 4. Computer Workstations across bays (with glowing dual monitors)
  for (const d of CAMPUS_DESKS) {
    // Desk surface
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(d.x - 12, d.y - 6, 24, 12);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(d.x - 12, d.y - 6, 24, 12);

    if (d.hasMonitors) {
      // Dual monitors with cyan glow
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(d.x - 9, d.y - 12, 8, 7);
      ctx.fillRect(d.x + 1, d.y - 12, 8, 7);

      // Glowing screens
      ctx.fillStyle = "#06b6d4";
      ctx.fillRect(d.x - 8, d.y - 11, 6, 5);
      ctx.fillRect(d.x + 2, d.y - 11, 6, 5);
    }
  }

  ctx.restore();
}

function drawClickRipples(
  ctx: CanvasRenderingContext2D,
  ripples: RippleEffect[]
): void {
  for (const ripple of ripples) {
    ctx.save();
    ctx.strokeStyle = `rgba(6, 182, 212, ${ripple.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(ripple.x, ripple.y, ripple.radius, ripple.radius * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
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

  ctx.save();

  // 1. Selection indicator on the floor (Matches Josiah's cyan foot ring in screenshot)
  if (isSelected) {
    // Glowing cyan floor circle
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 18, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating cyan brackets
    ctx.save();
    ctx.translate(x, y + 4);
    ctx.rotate(tick * 0.04);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-18, -10, 36, 20);
    ctx.restore();
  } else if (isHovered) {
    // Soft hover ring
    ctx.strokeStyle = "rgba(148, 163, 184, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 15, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Contact Shadow on floor
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Walking bobbing animation
  const isWalking = !!agent.targetCoordinates;
  const bob = isWalking ? Math.sin(tick * 0.45) * 2.5 : Math.sin(tick * 0.06) * 0.8;
  const cy = y + bob;

  // 4. Chibi Isometric Character Sprite with Department Accessories
  // Hair color & skin tone
  const skinTone = agent.department === "Executive" || agent.id === "blaze" ? "#fed7aa" : "#fed7aa";
  const hairColor = agent.id === "josiah" ? "#312e81" : agent.id === "bonnie" || agent.id === "mary-grace" ? "#7c2d12" : "#0f172a";

  // Body / Outfit
  ctx.fillStyle = agent.color;
  ctx.fillRect(x - 5, cy - 4, 10, 8);

  // Department-specific outfit trim
  if (agent.department === "Executive") {
    // Executive Suit collar & tie
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 1, cy - 4, 2, 4);
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(x - 1, cy - 2, 2, 4);
  } else if (agent.department === "Engineering") {
    // Dev Hoodie pocket & drawstrings
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(x - 3, cy, 6, 3);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 2, cy - 4, 1, 3);
    ctx.fillRect(x + 1, cy - 4, 1, 3);
  } else if (agent.department === "Database" || agent.department === "Security") {
    // Tactical cyber harness badge
    ctx.fillStyle = "#020617";
    ctx.fillRect(x - 3, cy - 3, 6, 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(x - 2, cy - 1, 4, 2);
  }

  // Legs / Feet
  ctx.fillStyle = "#1e293b";
  if (isWalking) {
    const legPhase = Math.sin(tick * 0.45);
    ctx.fillRect(x - 4, cy + 4, 3, 3 + legPhase);
    ctx.fillRect(x + 1, cy + 4, 3, 3 - legPhase);
  } else {
    ctx.fillRect(x - 4, cy + 4, 3, 3);
    ctx.fillRect(x + 1, cy + 4, 3, 3);
  }

  // Head
  ctx.fillStyle = skinTone;
  ctx.fillRect(x - 4, cy - 12, 8, 8);

  // Hair / Hat
  ctx.fillStyle = hairColor;
  ctx.fillRect(x - 5, cy - 14, 10, 4);

  // Eyes
  ctx.fillStyle = "#020617";
  ctx.fillRect(x - 2, cy - 9, 1.5, 2);
  ctx.fillRect(x + 1, cy - 9, 1.5, 2);

  // Department Accessories (Glasses, Visors, Headsets, Headbands)
  if (agent.department === "Security" || agent.id === "arwin" || agent.id === "christian") {
    // Glasses / Cyber HUD Visor
    ctx.fillStyle = agent.id === "john-lloyd" ? "#38bdf8" : "#94a3b8";
    ctx.fillRect(x - 3, cy - 9, 3, 2);
    ctx.fillRect(x + 1, cy - 9, 3, 2);
    ctx.fillRect(x, cy - 9, 1, 1);
  } else if (agent.department === "Executive" || agent.id === "gian" || agent.id === "neil-mar") {
    // Command Headset & Mic boom
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(x - 5, cy - 11, 2, 4);
    ctx.fillRect(x - 4, cy - 7, 3, 1);
  } else if (agent.status === "gym") {
    // Athletic Headband
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(x - 5, cy - 13, 10, 2);
  } else if (agent.status === "eating") {
    // Coffee mug held in hand
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 4, cy - 2, 3, 4);
    ctx.fillStyle = "#78350f";
    ctx.fillRect(x + 5, cy - 2, 1, 1);
  }

  // Active typing hands when working
  if (agent.status === "working") {
    const handBob = Math.sin(tick * 0.4) * 1;
    ctx.fillStyle = skinTone;
    ctx.fillRect(x - 4, cy + 1 + handBob, 2, 2);
    ctx.fillRect(x + 2, cy + 1 - handBob, 2, 2);
  }

  // 5. Status color dot matching screenshot
  let dotColor = "#22c55e"; // Working (green)
  if (agent.status === "eating") dotColor = "#f97316"; // Eating (orange)
  else if (agent.status === "gym") dotColor = "#38bdf8"; // Gym (sky)
  else if (agent.status === "meeting") dotColor = "#d946ef"; // Meeting (purple)
  else if (agent.status === "break") dotColor = "#eab308"; // Break (amber)
  else if (agent.status === "waiting_approval") dotColor = "#ef4444"; // Waiting (red)

  // 6. Name Tag Pill (Rounded dark pill: "● Josiah", "● Arwin", etc.)
  ctx.font = "bold 9px monospace";
  const nameText = `● ${agent.name}`;
  const textMetrics = ctx.measureText(nameText);
  const tagW = textMetrics.width + 10;
  const tagH = 15;
  const tagX = x - tagW / 2;
  const tagY = cy - 28;

  // Tag background pill
  ctx.fillStyle = isSelected
    ? "rgba(3, 105, 161, 0.95)"
    : "rgba(10, 15, 30, 0.88)";
  ctx.strokeStyle = isSelected ? "#38bdf8" : "#334155";
  ctx.lineWidth = isSelected ? 1.5 : 1;

  ctx.beginPath();
  const radius = 4;
  ctx.moveTo(tagX + radius, tagY);
  ctx.lineTo(tagX + tagW - radius, tagY);
  ctx.quadraticCurveTo(tagX + tagW, tagY, tagX + tagW, tagY + radius);
  ctx.lineTo(tagX + tagW, tagY + tagH - radius);
  ctx.quadraticCurveTo(tagX + tagW, tagY + tagH, tagX + tagW - radius, tagY + tagH);
  ctx.lineTo(tagX + radius, tagY + tagH);
  ctx.quadraticCurveTo(tagX, tagY + tagH, tagX, tagY + tagH - radius);
  ctx.lineTo(tagX, tagY + radius);
  ctx.quadraticCurveTo(tagX, tagY, tagX + radius, tagY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Status dot
  ctx.fillStyle = dotColor;
  ctx.fillText("●", tagX + 4, tagY + 11);

  // Name text
  ctx.fillStyle = isSelected ? "#ffffff" : "#f1f5f9";
  ctx.fillText(agent.name, tagX + 13, tagY + 11);

  // 7. Floating Speech Bubble (ONLY rendered when selected or hovered to avoid canvas clutter)
  if ((isSelected || isHovered) && agent.speechBubble) {
    const bubbleText = agent.speechBubble;
    ctx.font = "bold 9px monospace, sans-serif";
    const bubbleMetrics = ctx.measureText(bubbleText);
    const bubbleW = Math.min(Math.max(bubbleMetrics.width + 16, 70), 220);
    const bubbleH = 20;
    const bubbleX = x - bubbleW / 2;
    const bubbleY = tagY - bubbleH - 7;

    ctx.save();
    if (isSelected) {
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 6;
    }

    ctx.fillStyle = "rgba(10, 15, 30, 0.95)";
    ctx.strokeStyle = isSelected ? "#38bdf8" : "#475569";
    ctx.lineWidth = isSelected ? 1.5 : 1;

    // Speech bubble rounded box
    ctx.beginPath();
    const r = 4;
    ctx.moveTo(bubbleX + r, bubbleY);
    ctx.lineTo(bubbleX + bubbleW - r, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + r);
    ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - r);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - r, bubbleY + bubbleH);
    ctx.lineTo(bubbleX + r, bubbleY + bubbleH);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - r);
    ctx.lineTo(bubbleX, bubbleY + r);
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + r, bubbleY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Downward arrow pointer pointing directly at name tag
    ctx.beginPath();
    ctx.moveTo(x - 4, bubbleY + bubbleH);
    ctx.lineTo(x, bubbleY + bubbleH + 5);
    ctx.lineTo(x + 4, bubbleY + bubbleH);
    ctx.closePath();
    ctx.fillStyle = "rgba(10, 15, 30, 0.95)";
    ctx.fill();
    ctx.strokeStyle = isSelected ? "#38bdf8" : "#475569";
    ctx.stroke();

    ctx.restore();

    // Speech text
    ctx.fillStyle = isSelected ? "#38bdf8" : "#f1f5f9";
    const displayStr = bubbleText.length > 32 ? bubbleText.substring(0, 30) + "…" : bubbleText;
    ctx.fillText(displayStr, bubbleX + 8, bubbleY + 13);
  }

  ctx.restore();
}
