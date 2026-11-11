import { getDatabase } from "./supabase/server";
import fs from "fs";
import path from "path";
import { RadarItem, RadarTopic } from "@/types";

const RADAR_DIR = path.resolve(process.env.OFFICE_DATA_DIR || process.cwd(), "radar");
const RADAR_FILE = path.join(RADAR_DIR, "data.json");

export interface ScoringInput {
  starsGrowth: number;
  topic: RadarTopic;
  description: string;
  daysSinceLastCommit: number;
}

export const SEED_RADAR_REPOS: Array<Omit<RadarItem, "score" | "lastScannedAt"> & { daysSinceLastCommit: number }> = [
  {
    id: "pixel-agents-hq/pixel-agents",
    repo: "pixel-agents-hq/pixel-agents",
    description: "Visual 2D pixel-art virtual office headquarters for autonomous coding agents.",
    stars: 3840,
    starsGrowth: 620,
    topic: "ai-agents",
    url: "https://github.com/pixel-agents-hq/pixel-agents",
    daysSinceLastCommit: 0,
  },
  {
    id: "mem0ai/mem0",
    repo: "mem0ai/mem0",
    description: "The memory layer for personalized AI agents and multi-agent systems.",
    stars: 21500,
    starsGrowth: 480,
    topic: "memory",
    url: "https://github.com/mem0ai/mem0",
    daysSinceLastCommit: 1,
  },
  {
    id: "getzep/graphiti",
    repo: "getzep/graphiti",
    description: "Temporally aware knowledge graph engine for dynamic agent memory over MCP.",
    stars: 6200,
    starsGrowth: 390,
    topic: "memory",
    url: "https://github.com/getzep/graphiti",
    daysSinceLastCommit: 2,
  },
  {
    id: "remotion-dev/remotion",
    repo: "remotion-dev/remotion",
    description: "Make videos programmatically with React and generative AI automation.",
    stars: 19800,
    starsGrowth: 210,
    topic: "video",
    url: "https://github.com/remotion-dev/remotion",
    daysSinceLastCommit: 1,
  },
  {
    id: "anthropics/claude-code",
    repo: "anthropics/claude-code",
    description: "Agentic coding tool and subagent orchestration runtime.",
    stars: 14200,
    starsGrowth: 750,
    topic: "ai-agents",
    url: "https://github.com/anthropics/claude-code",
    daysSinceLastCommit: 0,
  },
  {
    id: "coqui-ai/TTS",
    repo: "coqui-ai/TTS",
    description: "Deep learning toolkit for Text-to-Speech and voice cloning.",
    stars: 32400,
    starsGrowth: 140,
    topic: "voice",
    url: "https://github.com/coqui-ai/TTS",
    daysSinceLastCommit: 12,
  },
  {
    id: "elevenlabs/elevenlabs-python",
    repo: "elevenlabs/elevenlabs-python",
    description: "Official Python library for real-time voice synthesis and agents.",
    stars: 4300,
    starsGrowth: 180,
    topic: "voice",
    url: "https://github.com/elevenlabs/elevenlabs-python",
    daysSinceLastCommit: 3,
  },
];

export function calculateRadarScore(input: ScoringInput): number {
  // 1. Stars growth normalized [0, 100] (500 weekly stars = 100)
  const safeGrowth = Math.max(0, input.starsGrowth || 0);
  const sgNorm = Math.min(100, (safeGrowth / 500) * 100);

  // 2. Topic relevance [0, 100]
  let topicRelevance = 50;
  const descLower = (input.description || "").toLowerCase();
  const topicKeyword = input.topic.replace("-", " ").toLowerCase();

  if (descLower.includes(topicKeyword)) {
    topicRelevance = 100;
  } else if (descLower.includes("agent") || descLower.includes("memory") || descLower.includes("video") || descLower.includes("voice")) {
    topicRelevance = 75;
  } else {
    topicRelevance = 40;
  }

  // 3. Freshness [0, 100] based on days since last commit
  const days = Math.max(0, input.daysSinceLastCommit || 0);
  const freshness = Math.max(0, 100 - days * 5);

  // Formula: (SG * 0.40) + (TR * 0.40) + (F * 0.20)
  const rawScore = sgNorm * 0.4 + topicRelevance * 0.4 + freshness * 0.2;
  return Math.round(Math.min(100, Math.max(0, rawScore)));
}

function ensureRadarDirectory(): void {
  if (!fs.existsSync(RADAR_DIR)) {
    fs.mkdirSync(RADAR_DIR, { recursive: true });
  }
}

export async function getRadarData(): Promise<RadarItem[]> {
  const db = getDatabase();
  if (db) {
    const { data, error } = await db.from("office_radar").select("data");
    if (error) throw new Error("Could not load Radar data.");
    return data.map(row => row.data as RadarItem).sort((a,b) => b.score - a.score);
  }
  ensureRadarDirectory();
  if (!fs.existsSync(RADAR_FILE)) {
    runRadarScanSync();
  }
  try {
    const raw = fs.readFileSync(RADAR_FILE, "utf-8");
    const parsed: RadarItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return runRadarScanSync();
    }
    return parsed;
  } catch (error) {
    return runRadarScanSync();
  }
}

function scoreRadarItems(): RadarItem[] {
  const now = new Date().toISOString();
  const scoredItems: RadarItem[] = SEED_RADAR_REPOS.map((item) => {
    const score = calculateRadarScore({
      starsGrowth: item.starsGrowth,
      topic: item.topic,
      description: item.description,
      daysSinceLastCommit: item.daysSinceLastCommit,
    });

    return {
      id: item.id,
      repo: item.repo,
      description: item.description,
      stars: item.stars,
      starsGrowth: item.starsGrowth,
      topic: item.topic,
      score,
      url: item.url,
      lastScannedAt: now,
    };
  });

  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems;
}

function runRadarScanSync(): RadarItem[] {
  ensureRadarDirectory();
  const scoredItems = scoreRadarItems();
  const tempFile = `${RADAR_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(scoredItems, null, 2), "utf-8");
  fs.renameSync(tempFile, RADAR_FILE);

  return scoredItems;
}

export async function runRadarScan(): Promise<RadarItem[]> {
  const db = getDatabase();
  if (!db) return runRadarScanSync();
  const items = scoreRadarItems();
  for (const item of items) {
    const { error } = await db.from("office_radar").update({ data: item }).eq("id", item.id).select("id").single();
    if (error) throw new Error("Could not save the Radar refresh.");
  }
  return items;
}

