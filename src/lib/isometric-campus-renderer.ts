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

  // 6. Draw Room Static Furniture (Kitchenette, dining tables, server cluster, gym gear, whiteboards)
  drawCampusFurniture(ctx, tick);

  // 7. Draw Click Ripples
  drawClickRipples(ctx, activeRipples);

  // 8. Draw Workstations & Animated Agents sorted by Y coordinate for true isometric depth
  type DepthItem =
    | { type: "desk"; desk: IsometricDesk; y: number }
    | { type: "agent"; agent: AgentProfile; y: number };

  const depthItems: DepthItem[] = [
    ...CAMPUS_DESKS.map((d) => ({ type: "desk" as const, desk: d, y: d.y })),
    ...agents.map((a) => ({ type: "agent" as const, agent: a, y: a.currentCoordinates.y })),
  ];

  // Sort by Y: smaller Y (further away) drawn first; larger Y (closer) drawn on top
  depthItems.sort((a, b) => a.y - b.y);

  for (const item of depthItems) {
    if (item.type === "desk") {
      drawSingleWorkstation(ctx, item.desk, tick);
    } else {
      drawAgentSprite(
        ctx,
        item.agent,
        item.agent.id === selectedAgentId,
        item.agent.id === hoveredAgentId,
        tick
      );
    }
  }

  ctx.restore();
}

function drawExteriorLawnAndRoad(ctx: CanvasRenderingContext2D, tick: number): void {
  // 1. Dark lush teal lawn covering canvas
  ctx.fillStyle = "#022c22";
  ctx.fillRect(-2000, -2000, 6000, 6000);

  // Subtle isometric grid on ground
  ctx.strokeStyle = "rgba(4, 120, 87, 0.15)";
  ctx.lineWidth = 1;
  const gridSize = 28;
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

  // 2. Concrete pedestrian pathway connecting zebra crossing to building entrance
  ctx.save();
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(110, 520);
  ctx.lineTo(240, 470);
  ctx.lineTo(255, 485);
  ctx.lineTo(125, 535);
  ctx.closePath();
  ctx.fill();

  // Pathway paving slab joints
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  for (let p = 0; p < 8; p++) {
    const px = 110 + p * 16;
    const py = 520 - p * 6;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 15, py + 15);
    ctx.stroke();
  }

  // Solar path bollards along walkway with soft cyan glow
  const bollards = [
    { x: 120, y: 505 },
    { x: 155, y: 490 },
    { x: 190, y: 475 },
    { x: 225, y: 460 },
  ];
  for (const b of bollards) {
    // Halo glow
    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.beginPath();
    ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Post
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(b.x - 2, b.y - 6, 4, 8);
    // Lamp head
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(b.x - 2, b.y - 8, 4, 2);
  }

  // Bike rack near entrance
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  for (let br = 0; br < 3; br++) {
    const bx = 260 + br * 8;
    const by = 505 - br * 3;
    ctx.beginPath();
    ctx.arc(bx, by, 4, Math.PI, 0);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Stylized Isometric Pine & Deciduous Trees
  const trees = [
    { x: 300, y: 110, size: 26 },
    { x: 580, y: 110, size: 26 },
    { x: 740, y: 170, size: 28 },
    { x: 780, y: 310, size: 28 },
    { x: 60, y: 160, size: 26 },
    { x: 35, y: 350, size: 28 },
    { x: 45, y: 480, size: 26 },
    { x: 700, y: 420, size: 26 },
  ];

  for (const tree of trees) {
    // Tree ground shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
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

  // 4. Asphalt road running along the bottom-left isometric edge
  ctx.save();
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
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.beginPath();
  ctx.moveTo(370, 75);
  ctx.lineTo(690, 255);
  ctx.lineTo(495, 475);
  ctx.lineTo(365, 505);
  ctx.lineTo(35, 435);
  ctx.lineTo(35, 255);
  ctx.closePath();
  ctx.fill();

  // Base concrete foundation with beveled edge
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

  // Outer foundation bevel stroke
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Main entrance glass sliding doors with green sensor indicator
  ctx.save();
  ctx.fillStyle = "#0369a1";
  ctx.fillRect(225, 465, 30, 8);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.strokeRect(225, 465, 30, 8);

  // Green active sensor LED above entrance
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(238, 463, 4, 2);
  ctx.restore();
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

  // 1. Base floor fill
  ctx.fillStyle = room.floorColor;
  ctx.fill();

  // Clip strictly to room boundary so textures and lines stay inside
  ctx.save();
  ctx.clip();

  // 2. Room-specific rich floor textures
  if (room.id === "pantry") {
    // Warm wood parquet flooring: diagonal parquet slats
    ctx.strokeStyle = "rgba(180, 83, 9, 0.25)";
    ctx.lineWidth = 1;
    for (let d = -100; d < 500; d += 14) {
      ctx.beginPath();
      ctx.moveTo(d, 100);
      ctx.lineTo(d + 200, 400);
      ctx.stroke();
    }
    // Woven circular dining rug under the eating tables
    ctx.fillStyle = "rgba(69, 26, 3, 0.65)";
    ctx.beginPath();
    ctx.ellipse(125, 275, 55, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (room.id === "gym") {
    // Interlocking athletic rubber tiles with sprint track lanes
    ctx.strokeStyle = "rgba(244, 63, 94, 0.2)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < 400; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 300);
      ctx.lineTo(gx + 150, 520);
      ctx.stroke();
    }
    // Sprint lane 1 & 2 markings
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(80, 420);
    ctx.lineTo(260, 470);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(110, 390);
    ctx.lineTo(290, 440);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (room.id === "server_bay") {
    // High-tech raised server grating panels with glowing blue conduit lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
    ctx.lineWidth = 1;
    for (let sx = 350; sx < 700; sx += 22) {
      ctx.beginPath();
      ctx.moveTo(sx, 50);
      ctx.lineTo(sx - 100, 250);
      ctx.stroke();
    }
    // Pulsing blue power trace leading to The Brain
    const glowAlpha = 0.35 + Math.sin(tick * 0.08) * 0.15;
    ctx.strokeStyle = `rgba(56, 189, 248, ${glowAlpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(480, 100);
    ctx.lineTo(430, 200);
    ctx.stroke();
  } else if (room.id === "engineering") {
    // Matrix cyber grid with neon green data conduits
    ctx.strokeStyle = "rgba(34, 197, 94, 0.2)";
    ctx.lineWidth = 1;
    for (let ex = 450; ex < 700; ex += 20) {
      ctx.beginPath();
      ctx.moveTo(ex, 200);
      ctx.lineTo(ex - 80, 350);
      ctx.stroke();
    }
    const engGlow = 0.35 + Math.sin(tick * 0.1) * 0.2;
    ctx.strokeStyle = `rgba(34, 197, 94, ${engGlow})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(620, 240);
    ctx.lineTo(500, 270);
    ctx.stroke();
  } else if (room.id === "workstations") {
    // Obsidian executive tiles with magenta neon trim
    ctx.strokeStyle = "rgba(217, 70, 239, 0.2)";
    ctx.lineWidth = 1;
    for (let wx = 400; wx < 700; wx += 24) {
      ctx.beginPath();
      ctx.moveTo(wx, 250);
      ctx.lineTo(wx - 100, 480);
      ctx.stroke();
    }
  } else if (room.id === "operations") {
    // Cleanroom tech tiles with cyan grid lines
    ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
    ctx.lineWidth = 1;
    for (let ox = 250; ox < 450; ox += 18) {
      ctx.beginPath();
      ctx.moveTo(ox, 340);
      ctx.lineTo(ox + 80, 500);
      ctx.stroke();
    }
  } else if (room.id === "focus_work") {
    // Slate purple floor tiles
    ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
    ctx.lineWidth = 1;
    for (let fx = 150; fx < 420; fx += 22) {
      ctx.beginPath();
      ctx.moveTo(fx, 50);
      ctx.lineTo(fx + 100, 230);
      ctx.stroke();
    }
  }

  // 3. Department Floor Stencil Labels
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = `${room.borderColor}66`;
  const labels: Record<string, { text: string; x: number; y: number }> = {
    focus_work:   { text: "// FOCUS WORK [SD/UX]",         x: 230, y: 110 },
    server_bay:   { text: "// SERVER & SECURITY [DBA/SEC]", x: 460, y: 105 },
    engineering:  { text: "// ENGINEERING [DEV SPRINT]",    x: 540, y: 260 },
    workstations: { text: "// OPERATIONS & TBX STORE",      x: 520, y: 405 },
    pantry:       { text: "// PANTRY & ALL-HANDS LOUNGE",   x: 100, y: 220 },
    gym:          { text: "// ATHLETIC REC & GYM RECOVERY", x: 130, y: 440 },
    operations:   { text: "// RESEARCH & RADAR TELEMETRY",  x: 300, y: 475 },
    brain:        { text: "// THE BRAIN [COMMAND ORB]",     x: 360, y: 335 },
  };
  const lbl = labels[room.id];
  if (lbl) {
    ctx.fillText(lbl.text, lbl.x, lbl.y);
  }

  ctx.restore(); // Undo clip

  // 4. Perimeter Neon Floor Trim
  ctx.strokeStyle = room.borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.strokeStyle = `${room.borderColor}33`;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

function drawIsometricWalls(ctx: CanvasRenderingContext2D): void {
  const wallHeight = 24;

  // Exterior perimeter wall segments with 3D height
  const outerSegments = [
    { from: { x: 370, y: 55 }, to: { x: 45, y: 240 } },
    { from: { x: 370, y: 55 }, to: { x: 675, y: 135 } },
    { from: { x: 675, y: 135 }, to: { x: 675, y: 350 } },
    { from: { x: 45, y: 240 }, to: { x: 45, y: 420 } },
    { from: { x: 45, y: 420 }, to: { x: 280, y: 480 } },
    { from: { x: 675, y: 350 }, to: { x: 485, y: 460 } },
    { from: { x: 485, y: 460 }, to: { x: 375, y: 490 } },
    { from: { x: 375, y: 490 }, to: { x: 280, y: 480 } },
  ];

  ctx.save();
  for (const seg of outerSegments) {
    // Architectural glass panel with subtle blue tint
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.beginPath();
    ctx.moveTo(seg.from.x, seg.from.y);
    ctx.lineTo(seg.to.x, seg.to.y);
    ctx.lineTo(seg.to.x, seg.to.y - wallHeight);
    ctx.lineTo(seg.from.x, seg.from.y - wallHeight);
    ctx.closePath();
    ctx.fill();

    // Top beveled metallic cap
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(seg.from.x, seg.from.y - wallHeight);
    ctx.lineTo(seg.to.x, seg.to.y - wallHeight);
    ctx.stroke();

    // Glass reflection diagonal sheen lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.lineWidth = 1;
    const midX = (seg.from.x + seg.to.x) / 2;
    const midY = (seg.from.y + seg.to.y) / 2;
    ctx.beginPath();
    ctx.moveTo(midX - 12, midY - 6);
    ctx.lineTo(midX + 8, midY - 18);
    ctx.stroke();
  }

  // Interior glass partitions with aluminum mullions
  const interiorWalls = [
    { from: { x: 370, y: 55 },  to: { x: 400, y: 150 } },
    { from: { x: 190, y: 155 }, to: { x: 300, y: 220 } },
    { from: { x: 400, y: 150 }, to: { x: 530, y: 220 } },
    { from: { x: 280, y: 480 }, to: { x: 340, y: 350 } },
    { from: { x: 375, y: 490 }, to: { x: 420, y: 410 } },
  ];

  for (const wall of interiorWalls) {
    // Glass panel
    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(wall.from.x, wall.from.y);
    ctx.lineTo(wall.to.x, wall.to.y);
    ctx.lineTo(wall.to.x, wall.to.y - 18);
    ctx.lineTo(wall.from.x, wall.from.y - 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vertical aluminum mullions at ends
    ctx.fillStyle = "#475569";
    ctx.fillRect(wall.from.x - 1, wall.from.y - 18, 2, 18);
    ctx.fillRect(wall.to.x - 1, wall.to.y - 18, 2, 18);
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

  // 1. Radiating glowing energy conduits leading out to surrounding bays
  const conduitTargets = [
    { x: 310, y: 170, color: "#a855f7" }, // Focus work
    { x: 470, y: 140, color: "#3b82f6" }, // Server bay
    { x: 530, y: 270, color: "#22c55e" }, // Engineering
    { x: 480, y: 380, color: "#d946ef" }, // Workstations
    { x: 340, y: 390, color: "#06b6d4" }, // Research
    { x: 250, y: 280, color: "#f97316" }, // Pantry
  ];

  for (const c of conduitTargets) {
    const cableGlow = 0.3 + Math.sin(tick * 0.08 + c.x) * 0.2;
    ctx.strokeStyle = `${c.color}${Math.floor(cableGlow * 255).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(c.x, c.y);
    ctx.stroke();
  }

  // 2. Stepped 3-Tier Central Cyber Platform
  // Tier 1: Outer cyan rim with rotating tick markers
  ctx.fillStyle = "#030712";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 78, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 16 Rotating perimeter tick marks
  const numTicks = 16;
  const tickRot = tick * 0.02;
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  for (let t = 0; t < numTicks; t++) {
    const angle = tickRot + (t * Math.PI * 2) / numTicks;
    const tx1 = cx + Math.cos(angle) * 74;
    const ty1 = cy + Math.sin(angle) * 44;
    const tx2 = cx + Math.cos(angle) * 78;
    const ty2 = cy + Math.sin(angle) * 48;
    ctx.beginPath();
    ctx.moveTo(tx1, ty1);
    ctx.lineTo(tx2, ty2);
    ctx.stroke();
  }

  // Tier 2: Pulsing mid energy ring
  const pulse = Math.sin(tick * 0.08) * 3;
  ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 + Math.sin(tick * 0.05) * 0.25})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 62 + pulse, 38 + pulse * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Tier 3: Inner ring with command console desk
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 48, 29, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 54, 33, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 3. 4 Holographic Touchscreen Podiums facing inward for Leads
  const podiums = [
    { x: cx, y: cy - 28, rot: 0 },
    { x: cx + 46, y: cy, rot: 1 },
    { x: cx, y: cy + 28, rot: 2 },
    { x: cx - 46, y: cy, rot: 3 },
  ];
  for (const pod of podiums) {
    // Pedestal
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(pod.x - 4, pod.y - 6, 8, 12);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(pod.x - 4, pod.y - 6, 8, 12);
    // Glowing touch interface
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(pod.x - 3, pod.y - 8, 6, 3);
  }

  // 4. Central Holographic Floating Sphere & Orbital Energy Rings
  const orbY = cy - 14;
  ctx.translate(cx, orbY);

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

  // Upward drifting holographic energy sparks
  for (let sp = 0; sp < 6; sp++) {
    const spPhase = (tick * 0.06 + sp * 1.2) % 6;
    const spX = Math.sin(tick * 0.1 + sp * 2) * 14;
    const spY = -spPhase * 5;
    const spAlpha = Math.max(0, 1 - spPhase / 6);
    ctx.fillStyle = `rgba(103, 232, 249, ${spAlpha})`;
    ctx.fillRect(spX - 1, spY - 1, 2, 2);
  }

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

  // ── 1. PANTRY & CANTEEN (Mid-Left / Warm Orange Bay) ─────────────────────
  // Kitchenette counter against back wall
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(60, 185, 80, 16);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 185, 80, 16);

  // Stainless steel sink
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(68, 188, 14, 8);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(72, 186, 3, 3); // Faucet

  // Espresso coffee machine with rising steam particles
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(92, 181, 14, 12);
  ctx.strokeStyle = "#f59e0b";
  ctx.strokeRect(92, 181, 14, 12);
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(94, 183, 2, 2); // Power LED
  // Rising steam
  const steamY = Math.sin(tick * 0.15) * 3;
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillRect(98, 175 + steamY, 2, 2);
  ctx.fillRect(100, 172 - steamY, 2, 2);

  // Microwave oven with green digital timer
  ctx.fillStyle = "#020617";
  ctx.fillRect(116, 183, 16, 10);
  ctx.strokeStyle = "#334155";
  ctx.strokeRect(116, 183, 16, 10);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(126, 185, 4, 2); // Timer LED

  // Double-door stainless steel refrigerator
  ctx.fillStyle = "#64748b";
  ctx.fillRect(45, 195, 18, 32);
  ctx.strokeStyle = "#94a3b8";
  ctx.strokeRect(45, 195, 18, 32);
  ctx.fillStyle = "#334155";
  ctx.fillRect(53, 195, 1, 32); // Door seam
  // Magnets & sticky notes
  ctx.fillStyle = "#eab308";
  ctx.fillRect(48, 202, 3, 3);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(56, 206, 3, 3);

  // Snack vending machine
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(48, 235, 18, 28);
  ctx.strokeStyle = "#f59e0b";
  ctx.strokeRect(48, 235, 18, 28);
  // Glowing snack shelves
  ctx.fillStyle = "#fef08a";
  ctx.fillRect(51, 239, 12, 3);
  ctx.fillStyle = "#f87171";
  ctx.fillRect(51, 244, 12, 3);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(51, 249, 12, 3);
  // Coin slot & dispense tray
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(52, 255, 10, 4);

  // Water cooler with transparent bubbly cyan jug
  ctx.fillStyle = "#334155";
  ctx.fillRect(180, 230, 14, 20);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(182, 222, 10, 8); // Water jug
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(185, 225, 2, 2); // Bubble

  // Dining Table 1: Pizza party table
  ctx.fillStyle = "#b45309";
  ctx.beginPath();
  ctx.ellipse(100, 275, 24, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#78350f";
  ctx.stroke();
  // 3 Stools
  for (let st = 0; st < 3; st++) {
    const sa = (st * Math.PI * 2) / 3;
    const sx = 100 + Math.cos(sa) * 26;
    const sy = 275 + Math.sin(sa) * 14;
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.ellipse(sx, sy, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Pizza box with warm slice
  ctx.fillStyle = "#fed7aa";
  ctx.fillRect(94, 271, 12, 8);
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(97, 273, 5, 4);

  // Dining Table 2: Donut & coffee table
  ctx.fillStyle = "#b45309";
  ctx.beginPath();
  ctx.ellipse(150, 280, 22, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#78350f";
  ctx.stroke();
  // 2 Stools
  ctx.fillStyle = "#78350f";
  ctx.beginPath();
  ctx.ellipse(132, 280, 5, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(168, 280, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // Donut box
  ctx.fillStyle = "#f472b6";
  ctx.fillRect(145, 277, 9, 6);

  // Potted Monstera / Palm in ceramic planter
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(68, 268, 10, 10);
  ctx.fillStyle = "#15803d";
  ctx.beginPath();
  ctx.arc(73, 264, 7, 0, Math.PI * 2);
  ctx.arc(69, 262, 5, 0, Math.PI * 2);
  ctx.arc(77, 263, 6, 0, Math.PI * 2);
  ctx.fill();

  // ── 2. REC & GYM (Bottom-Left / Crimson Bay) ─────────────────────────────
  // 3 High-Tech Cyber Treadmills
  const treadmills = [
    { x: 275, y: 410 },
    { x: 305, y: 425 },
    { x: 335, y: 440 },
  ];
  for (let tm = 0; tm < treadmills.length; tm++) {
    const t = treadmills[tm];
    // Base frame
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(t.x, t.y, 22, 11);
    ctx.strokeStyle = "#334155";
    ctx.strokeRect(t.x, t.y, 22, 11);
    // Running belt with motion tick
    ctx.fillStyle = (tick + tm * 3) % 8 < 4 ? "#1e293b" : "#334155";
    ctx.fillRect(t.x + 2, t.y + 2, 18, 7);
    // Front console upright
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(t.x + 18, t.y - 6, 4, 8);
    // Digital LED display
    ctx.fillStyle = tm === 0 ? "#22c55e" : tm === 1 ? "#38bdf8" : "#f43f5e";
    ctx.fillRect(t.x + 17, t.y - 7, 5, 3);
  }

  // Weight lifting bench with Olympic barbell & weights
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(115, 385, 20, 8);
  ctx.fillStyle = "#94a3b8"; // Barbell bar
  ctx.fillRect(112, 382, 26, 2);
  ctx.fillStyle = "#020617"; // Olympic weight plates
  ctx.fillRect(110, 379, 3, 8);
  ctx.fillRect(137, 379, 3, 8);

  // Multi-tier dumbbell rack
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(75, 365, 26, 8);
  ctx.fillStyle = "#475569";
  for (let db = 0; db < 4; db++) {
    ctx.fillRect(78 + db * 6, 363, 4, 4);
  }

  // Heavy punching bag on cantilever stand
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 345);
  ctx.lineTo(90, 325);
  ctx.lineTo(100, 325);
  ctx.stroke();
  ctx.fillStyle = "#ef4444"; // Red punching bag
  ctx.fillRect(97, 328, 7, 16);

  // Athletic locker bank
  ctx.fillStyle = "#334155";
  ctx.fillRect(135, 350, 30, 20);
  ctx.strokeStyle = "#64748b";
  ctx.strokeRect(135, 350, 30, 20);
  for (let lk = 0; lk < 3; lk++) {
    ctx.strokeRect(135 + lk * 10, 350, 10, 20);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(142 + lk * 10, 358, 2, 3); // Dials
  }

  // Yoga mats with towels and water bottles
  // Cyan mat
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(230, 375, 24, 11);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(248, 376, 4, 4); // White towel
  // Pink mat
  ctx.fillStyle = "#ec4899";
  ctx.fillRect(265, 380, 24, 11);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(283, 382, 3, 4); // Shaker bottle

  // ── 3. SERVER BAY & SECURITY (Top-Right / Blue Bay) ─────────────────────
  // 5 Tall server racks with blinking status LEDs
  const serverX = 475;
  const serverY = 75;
  for (let s = 0; s < 5; s++) {
    const sx = serverX + s * 16;
    const sy = serverY + s * 9;
    // Server tower body
    ctx.fillStyle = "#020617";
    ctx.fillRect(sx, sy, 14, 28);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, 14, 28);

    // Blinking LEDs
    ctx.fillStyle = (tick + s) % 12 < 6 ? "#22c55e" : "#0284c7";
    ctx.fillRect(sx + 2, sy + 4, 3, 2);
    ctx.fillStyle = (tick + s * 2) % 16 < 8 ? "#38bdf8" : "#10b981";
    ctx.fillRect(sx + 8, sy + 4, 3, 2);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(sx + 2, sy + 12, 3, 2);
    ctx.fillStyle = (tick + s) % 14 < 7 ? "#38bdf8" : "#22c55e";
    ctx.fillRect(sx + 8, sy + 12, 3, 2);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(sx + 2, sy + 20, 3, 2);
  }

  // Cybersecurity Threat Map Display on back wall
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(555, 105, 36, 18);
  ctx.strokeStyle = "#38bdf8";
  ctx.strokeRect(555, 105, 36, 18);
  // World map outline simulation & threat pings
  ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
  ctx.fillRect(560, 110, 10, 4);
  ctx.fillRect(572, 112, 14, 5);
  ctx.fillStyle = tick % 14 < 7 ? "#ef4444" : "#22c55e";
  ctx.fillRect(568, 111, 2, 2); // Threat ping node

  // DBA diagnostic console desk with live query graphs
  ctx.fillStyle = "#020617";
  ctx.fillRect(435, 125, 24, 12);
  ctx.strokeStyle = "#1e293b";
  ctx.strokeRect(435, 125, 24, 12);
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(437, 119, 10, 6);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(448, 119, 10, 6);

  // ── 4. ENGINEERING BAY (Mid-Right / Green Bay) ──────────────────────────
  // Sprint Kanban Board on wall
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(630, 215, 36, 18);
  ctx.strokeStyle = "#22c55e";
  ctx.strokeRect(630, 215, 36, 18);
  // 3 Column dividers: TODO, PROG, DONE
  ctx.strokeStyle = "#334155";
  ctx.beginPath();
  ctx.moveTo(642, 215); ctx.lineTo(642, 233);
  ctx.moveTo(654, 215); ctx.lineTo(654, 233);
  ctx.stroke();
  // Sticky notes
  ctx.fillStyle = "#facc15"; ctx.fillRect(633, 218, 4, 3);
  ctx.fillStyle = "#38bdf8"; ctx.fillRect(645, 220, 4, 3);
  ctx.fillStyle = "#4ade80"; ctx.fillRect(657, 218, 4, 3);

  // Potted succulent on side shelf
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(660, 270, 7, 7);
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(663, 268, 4, 0, Math.PI * 2);
  ctx.fill();

  // ── 5. FOCUS WORK BAY (Top-Left / Purple Bay) ───────────────────────────
  // UI Wireframe Showcase Display Screen on wall
  ctx.fillStyle = "#1e1b4b";
  ctx.fillRect(205, 115, 32, 18);
  ctx.strokeStyle = "#a855f7";
  ctx.strokeRect(205, 115, 32, 18);
  // Wireframe UI lines
  ctx.fillStyle = "#c084fc";
  ctx.fillRect(208, 118, 12, 3);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(208, 123, 24, 2);
  ctx.fillRect(208, 127, 18, 2);

  // Ergonomic design beanbag / focus pod
  ctx.fillStyle = "#581c87";
  ctx.beginPath();
  ctx.ellipse(335, 135, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a855f7";
  ctx.stroke();

  // Fiddle-leaf fig plant
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(215, 150, 8, 9);
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(219, 146, 6, 0, Math.PI * 2);
  ctx.fill();

  // ── 6. CLOUD & OPERATIONS BAY (Bottom-Right / Magenta Bay) ──────────────
  // TBX Shop inventory staging boxes
  ctx.fillStyle = "#b45309"; // Cardboard brown
  ctx.fillRect(640, 365, 14, 11);
  ctx.fillRect(650, 360, 12, 10);
  ctx.fillRect(644, 355, 11, 9);
  // Brown tape on top box
  ctx.fillStyle = "#78350f";
  ctx.fillRect(648, 355, 3, 9);

  // Barcode handheld scanner with red laser line
  ctx.fillStyle = "#020617";
  ctx.fillRect(635, 375, 4, 8);
  ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
  ctx.fillRect(633, 378, 6, 1); // Laser beam

  // Infrastructure uptime gauge wall screen
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(655, 310, 24, 14);
  ctx.strokeStyle = "#d946ef";
  ctx.strokeRect(655, 310, 24, 14);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(658, 314, 18, 3); // 99.99% green bar

  // ── 7. RESEARCH & DATA BAY (Bottom-Center / Teal Bay) ────────────────────
  // Wall-mounted GitHub Radar Star Velocity chart
  ctx.fillStyle = "#082f3d";
  ctx.fillRect(350, 485, 32, 16);
  ctx.strokeStyle = "#06b6d4";
  ctx.strokeRect(350, 485, 32, 16);
  // Velocity graph curve
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(353, 497);
  ctx.lineTo(360, 495);
  ctx.lineTo(368, 491);
  ctx.lineTo(378, 487);
  ctx.stroke();

  // Research archive bookshelf
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(295, 445, 18, 22);
  ctx.strokeStyle = "#475569";
  ctx.strokeRect(295, 445, 18, 22);
  // Book spines
  const bookColors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
  for (let bk = 0; bk < 5; bk++) {
    ctx.fillStyle = bookColors[bk];
    ctx.fillRect(297 + bk * 3, 448, 2, 7);
    ctx.fillRect(297 + bk * 3, 458, 2, 7);
  }

  ctx.restore();
}

export function drawSingleWorkstation(
  ctx: CanvasRenderingContext2D,
  d: IsometricDesk,
  tick: number
): void {
  ctx.save();

  // 1. Ergonomic mesh office chair behind the desk
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(d.x - 7, d.y - 14, 14, 8);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.strokeRect(d.x - 7, d.y - 14, 14, 8);

  // 2. Beveled desk surface
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(d.x - 13, d.y - 6, 26, 12);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.strokeRect(d.x - 13, d.y - 6, 26, 12);

  // Desk mat
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(d.x - 9, d.y - 3, 18, 7);

  // RGB Keyboard
  ctx.fillStyle = "#334155";
  ctx.fillRect(d.x - 6, d.y - 1, 9, 3);
  // Mouse
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(d.x + 5, d.y, 2, 2);

  // 3. Compact floor PC Tower with glowing circular RGB fan
  ctx.fillStyle = "#020617";
  ctx.fillRect(d.x + 8, d.y - 3, 6, 10);
  ctx.fillStyle = tick % 14 < 7 ? "#06b6d4" : "#a855f7";
  ctx.fillRect(d.x + 10, d.y, 2, 4); // Glowing fan

  // 4. Curved Dual Monitors with glowing code syntax
  if (d.hasMonitors) {
    // Monitor bezels
    ctx.fillStyle = "#020617";
    ctx.fillRect(d.x - 10, d.y - 12, 9, 8);
    ctx.fillRect(d.x + 1, d.y - 12, 9, 8);
    ctx.strokeStyle = "#1e293b";
    ctx.strokeRect(d.x - 10, d.y - 12, 9, 8);
    ctx.strokeRect(d.x + 1, d.y - 12, 9, 8);

    // Glowing screens
    ctx.fillStyle = "#0369a1";
    ctx.fillRect(d.x - 9, d.y - 11, 7, 6);
    ctx.fillRect(d.x + 2, d.y - 11, 7, 6);

    // Syntax code lines on screens
    ctx.fillStyle = "#67e8f9";
    ctx.fillRect(d.x - 8, d.y - 10, 5, 1);
    ctx.fillRect(d.x - 8, d.y - 8, 4, 1);
    ctx.fillRect(d.x + 3, d.y - 10, 5, 1);
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(d.x + 3, d.y - 8, 4, 1);
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
