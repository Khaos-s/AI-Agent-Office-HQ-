import { getDatabase } from "./supabase/server";
import { getAllAgents } from "./agent-registry";
import type { AgentProfile } from "@/types";

export async function readAgents(): Promise<AgentProfile[]> {
  const db = await getDatabase();
  if (!db) return getAllAgents();
  const { data, error } = await db.from("office_agents").select("data").order("id");
  if (error) throw new Error("Could not load the persistent agent roster.");
  return data.map(row => row.data as AgentProfile);
}

export async function saveAgent(agent: AgentProfile) {
  const db = await getDatabase();
  if (!db) return;
  const { data, error } = await db.from("office_agents").update({ data: agent }).eq("id", agent.id).select("id").single();
  if (error || !data) throw new Error("Could not save this agent. Please try again.");
}
