import type { RoomLocation } from "@/types";

export type Point = { x: number; y: number };
export const CAMPUS_WIDTH = 1400;
export const CAMPUS_HEIGHT = 880;
export const project = (x: number, y: number): Point => ({ x: 700 + (x - y) * 0.78, y: 85 + (x + y) * 0.39 });
export const unproject = (x: number, y: number): Point => ({ x: ((x - 700) / 0.78 + (y - 85) / 0.39) / 2, y: ((y - 85) / 0.39 - (x - 700) / 0.78) / 2 });

export const CAMPUS_ROOMS: { id: string; name: string; type: RoomLocation; x: number; y: number; color: string; floor: string; members: string[] }[] = [
  { id: "design", name: "DESIGN STUDIO", type: "focus_work", x: 20, y: 20, color: "#c4b5fd", floor: "#aaa9bd", members: ["julian", "bonnie"] },
  { id: "server", name: "SYSTEMS LAB", type: "server_bay", x: 300, y: 20, color: "#7dd3fc", floor: "#7196a5", members: ["arwin", "nelmar", "john-lloyd"] },
  { id: "engineering", name: "ENGINEERING", type: "focus_work", x: 580, y: 20, color: "#a3e2b4", floor: "#94b9a6", members: ["blaze", "mark", "lance", "christian"] },
  { id: "pantry", name: "THE COFFEE CLUB", type: "pantry", x: 20, y: 300, color: "#f7cc8d", floor: "#c9a27e", members: ["roy-jhan", "khent"] },
  { id: "brain", name: "THE BRAIN", type: "brain", x: 300, y: 300, color: "#79e4dc", floor: "#5f9895", members: ["josiah", "gian", "neil-mar", "anthony"] },
  { id: "operations", name: "OPERATIONS", type: "focus_work", x: 580, y: 300, color: "#f0b4bc", floor: "#ba9eaa", members: ["ferwi", "jayson", "jo-vincent", "gabriel"] },
  { id: "gym", name: "RECHARGE ROOM", type: "gym", x: 20, y: 580, color: "#f6b188", floor: "#ae9690", members: ["john-arvy"] },
  { id: "research", name: "RESEARCH & CONTENT", type: "focus_work", x: 300, y: 580, color: "#c5d8a0", floor: "#a9b397", members: ["keiru", "ryan", "mary-grace", "glor"] },
  { id: "lounge", name: "WELCOME LOUNGE", type: "all_hands", x: 580, y: 580, color: "#e8d8af", floor: "#c2b79c", members: [] },
];

export const STATIONS = Object.fromEntries(CAMPUS_ROOMS.flatMap(room => room.members.map((id, i) => [id, {
  room,
  x: room.x + 62 + (i % 2) * 118,
  y: room.y + 105 + Math.floor(i / 2) * 90,
}])));

export function roomAt(x: number, y: number) {
  const p = unproject(x, y);
  return CAMPUS_ROOMS.find(r => p.x >= r.x && p.x <= r.x + 240 && p.y >= r.y && p.y <= r.y + 240) ?? null;
}

export function isInsideCampus(x: number, y: number) {
  const p = unproject(x, y);
  return Number.isFinite(x) && Number.isFinite(y) && p.x >= 20 && p.x <= 820 && p.y >= 20 && p.y <= 820;
}
