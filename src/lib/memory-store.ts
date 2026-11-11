import { getDatabase } from "./supabase/server";
import fs from "fs";
import path from "path";
import { MemoryEntry } from "@/types";

const DATA_DIR = path.resolve(process.env.OFFICE_DATA_DIR || process.cwd(), "data");
const MEMORY_FILE = path.join(DATA_DIR, "memory.json");

export const SEED_MEMORIES: MemoryEntry[] = [
  {
    id: "mem-001",
    agentId: "lead",
    title: "Office Architecture Standard",
    content: "All department agents operate on 'One Agent, One Job' protocol. Any public or financial mutations require HITL approval.",
    tags: ["core", "governance", "architecture"],
    createdAt: new Date("2026-11-06T08:00:00Z").toISOString(),
  },
  {
    id: "mem-002",
    agentId: "research",
    title: "GitHub Radar Scoring Baseline",
    content: "Daily 6:00 AM Radar scan formula: (Stars Growth * 0.4) + (Topic Relevance * 0.4) + (Freshness * 0.2). Track AI agents, memory, video, voice.",
    tags: ["radar", "github", "methodology"],
    createdAt: new Date("2026-11-06T08:15:00Z").toISOString(),
  },
  {
    id: "mem-003",
    agentId: "tbx-shop",
    title: "TBX Return Policy Guidelines",
    content: "Damaged orders under $100 can be refunded after photo inspection. High-risk refunds over $100 require dual-operator approval.",
    tags: ["ecommerce", "shopify", "policy"],
    createdAt: new Date("2026-11-06T08:30:00Z").toISOString(),
  },
  {
    id: "mem-004",
    agentId: "dev",
    title: "Git Worktree Protocol",
    content: "Branch names must prefix with feature/ or fix/. Direct pushes to master/main are blocked by pre-commit hooks and branch protection.",
    tags: ["dev", "git", "standards"],
    createdAt: new Date("2026-11-06T08:45:00Z").toISOString(),
  },
];

function ensureFileExists(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(SEED_MEMORIES, null, 2), "utf-8");
  }
}

export async function getMemories(tag?: string): Promise<MemoryEntry[]> {
  const db = await getDatabase();
  if (db) {
    const { data, error } = await db.from("office_memories").select("data").order("data->>createdAt", { ascending: false });
    if (error) throw new Error("Could not load shared memory.");
    const entries = data.map(row => row.data as MemoryEntry);
    return tag ? entries.filter(m => m.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))) : entries;
  }
  ensureFileExists();
  try {
    const raw = fs.readFileSync(MEMORY_FILE, "utf-8");
    const parsed: MemoryEntry[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Memory store is not an array");
    if (!tag) return parsed;
    const lowerTag = tag.toLowerCase();
    return parsed.filter((m) => m.tags.some((t) => t.toLowerCase().includes(lowerTag)));
  } catch (error) {
    // Self-healing fallback on corruption
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(SEED_MEMORIES, null, 2), "utf-8");
    return tag
      ? SEED_MEMORIES.filter((m) => m.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())))
      : SEED_MEMORIES;
  }
}

export async function addMemory(entry: Omit<MemoryEntry, "id" | "createdAt">): Promise<MemoryEntry> {
  const newMemory: MemoryEntry = {
    ...entry,
    id: `mem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const db = await getDatabase();
  if (db) {
    const { error } = await db.from("office_memories").insert({ id: newMemory.id, data: newMemory });
    if (error) throw new Error("Could not save shared memory.");
    return newMemory;
  }
  const memories = await getMemories();
  memories.unshift(newMemory);

  const tempFile = `${MEMORY_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(memories, null, 2), "utf-8");
  fs.renameSync(tempFile, MEMORY_FILE);

  return newMemory;
}

export function resetMemoryStore(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(SEED_MEMORIES, null, 2), "utf-8");
}

