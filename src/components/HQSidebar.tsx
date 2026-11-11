"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentProfile, CampusStats, RoutingDestination } from "@/types";
import { X, ShieldAlert, ArrowRight } from "lucide-react";
import { AIPromptConsole } from "@/components/AIPromptConsole";

const STATUS_COLOR: Record<string, string> = {
  working:          "#bef264",
  eating:           "#fb923c",
  gym:              "#38bdf8",
  meeting:          "#a78bfa",
  break:            "#fbbf24",
  waiting_approval: "#f87171",
};

const STATUS_LABEL: Record<string, string> = {
  working:          "Working",
  eating:           "In pantry",
  gym:              "Rec & gym",
  meeting:          "In meeting",
  break:            "On break",
  waiting_approval: "Needs approval",
};

const STAT_ROWS = [
  { key: "working",          label: "Working",        color: "#bef264" },
  { key: "meeting",          label: "In meeting",     color: "#a78bfa" },
  { key: "eating",           label: "Eating",         color: "#fb923c" },
  { key: "gym",              label: "In gym",         color: "#38bdf8" },
  { key: "breakCount",       label: "On break",       color: "#fbbf24" },
  { key: "arriving",         label: "Arriving",       color: "#64748b" },
  { key: "waitingApproval",  label: "Needs approval", color: "#f87171" },
] as const;

interface HQSidebarProps {
  stats: CampusStats;
  agents: AgentProfile[];
  selectedAgent: AgentProfile | null;
  onSelectAgent: (agent: AgentProfile) => void;
  onRouteAgent: (agentId: string, destination: RoutingDestination) => void;
  onOpenApprovals: () => void;
  onTriggerTestHITL?: () => void;
  onPromptSuccess?: (agent: AgentProfile, responseMsg: string) => void;
}

export const HQSidebar: React.FC<HQSidebarProps> = ({
  stats,
  agents,
  selectedAgent,
  onSelectAgent,
  onRouteAgent,
  onOpenApprovals,
  onTriggerTestHITL,
  onPromptSuccess,
}) => {
  const [open, setOpen]       = useState(true);
  const [prevStats, setPrev]  = useState(stats);
  const sorted = [...agents].sort((a, b) => a.name.localeCompare(b.name));
  const agent  = selectedAgent || agents[0];
  const color  = STATUS_COLOR[agent?.status ?? ""] ?? "#64748b";

  // Track stat changes so we can flash numbers
  useEffect(() => {
    const timer = setTimeout(() => setPrev(stats), 1000);
    return () => clearTimeout(timer);
  }, [stats]);

  const statVal = (key: (typeof STAT_ROWS)[number]["key"]) => (stats as any)[key] as number;

  return (
    <>
      {/* Toggle tab — always visible */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        animate={{ right: open ? 316 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed top-1/2 z-50 -translate-y-1/2 rounded-l-lg border border-r-0 border-white/[0.08] bg-[#0d1117] px-1.5 py-3 text-[9px] font-semibold uppercase tracking-widest text-slate-500 shadow-xl transition hover:text-slate-200"
        style={{ writingMode: "vertical-rl" }}
      >
        {open ? "→ Hide" : "← Panel"}
      </motion.button>

      {/* Slide-over panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{   x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="slim-scroll fixed right-0 top-11 z-40 flex h-[calc(100vh-44px)] w-80 flex-col gap-0 overflow-y-auto border-l border-white/[0.07] bg-[#07090f]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Command Panel
              </span>
              <button onClick={() => setOpen(false)} className="text-slate-600 transition hover:text-slate-200">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* ── LIVE COUNTER ─────────────────────────────── */}
            <section className="border-b border-white/[0.06] px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                  Campus live counter
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-lime-300">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime-400" />
                  {stats.total} online
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {STAT_ROWS.map(({ key, label, color: dot }) => {
                  const val     = statVal(key);
                  const changed = val !== (prevStats as any)[key];
                  return (
                    <motion.div
                      key={key}
                      className="flex items-center justify-between text-xs"
                      animate={changed ? { backgroundColor: ["rgba(255,255,255,0.05)", "transparent"] } : {}}
                      transition={{ duration: 0.8 }}
                    >
                      <span className="flex items-center gap-2 text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
                        {label}
                      </span>
                      <motion.span
                        key={val}
                        initial={{ scale: changed ? 1.4 : 1, color: changed ? "#ffffff" : "#cbd5e1" }}
                        animate={{ scale: 1, color: "#cbd5e1" }}
                        transition={{ duration: 0.5 }}
                        className="font-semibold tabular-nums text-slate-300"
                      >
                        {val}
                      </motion.span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">
                <div className="rounded-lg bg-white/[0.03] p-2.5">
                  <p className="text-[9px] text-slate-500">Open tasks</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-100">{stats.openTasks}</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2.5">
                  <p className="text-[9px] text-slate-500">Accessories</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-100">{stats.accessories}</p>
                </div>
              </div>
            </section>

            {/* ── BOSS DESK / HITL ─────────────────────────── */}
            <section className="border-b border-white/[0.06] px-4 py-4">
              <button
                onClick={onOpenApprovals}
                className="group w-full rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3 text-left transition hover:border-amber-400/30 hover:bg-amber-400/[0.09]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-200">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
                    The Boss Desk // Approvals
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={stats.waitingApproval}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        stats.waitingApproval
                          ? "bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/40"
                          : "bg-white/[0.05] text-slate-500"
                      }`}
                    >
                      {stats.waitingApproval} pending
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                  {stats.waitingApproval
                    ? "Sensitive operations paused for sign-off."
                    : "All go-signals cleared. Operations nominal."}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-slate-400 transition group-hover:text-slate-200">
                  Review queue <ArrowRight className="h-3 w-3" />
                </div>
              </button>

              {onTriggerTestHITL && (
                <button
                  onClick={onTriggerTestHITL}
                  className="mt-2 text-[9px] text-slate-600 transition hover:text-amber-300"
                >
                  <ShieldAlert className="mr-0.5 inline h-3 w-3" />
                  Simulate approval request
                </button>
              )}
            </section>

            {/* ── AGENT INSPECTOR & ROUTING ────────────────── */}
            <section className="flex flex-1 flex-col px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                  Agent inspector & routing
                </span>
                <span className="text-[9px] text-slate-600">
                  {agents.length} total
                </span>
              </div>

              {/* Chip grid */}
              <div className="mt-3 flex flex-wrap gap-1">
                {sorted.map((a) => {
                  const active = agent?.id === a.id;
                  return (
                    <motion.button
                      key={a.id}
                      onClick={() => onSelectAgent(a)}
                      whileTap={{ scale: 0.92 }}
                      className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition ${
                        active
                          ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                          : "border-white/[0.07] bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-slate-100"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
                      {a.name}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected agent card */}
              <AnimatePresence mode="wait">
                {agent && (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{   opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 rounded-xl border border-white/[0.07] bg-[#0b1017] p-3"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                        style={{ background: `${color}1a`, border: `1px solid ${color}44`, color }}
                      >
                        {agent.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="truncate text-sm font-semibold text-slate-100">{agent.name}</p>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold"
                            style={{ background: `${color}1a`, color, border: `1px solid ${color}44` }}
                          >
                            {STATUS_LABEL[agent.status] ?? agent.status}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                          {agent.shortRole || agent.role}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 border-t border-white/[0.06] pt-2.5 text-[11px] leading-relaxed text-slate-400">
                      <span className="text-slate-600">Task · </span>
                      {agent.currentTask || "No active task"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Command Terminal */}
              {agent && (
                <div className="mt-3">
                  <AIPromptConsole
                    agent={agent}
                    onSuccess={onPromptSuccess}
                    onOpenApprovals={onOpenApprovals}
                  />
                </div>
              )}

              {/* Routing buttons */}
              {agent && (
                <>
                  <p className="mb-2 mt-4 text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                    Direct routing (A* walk)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["desk",   "Work desk",   "#bef264"],
                        ["pantry", "Pantry",       "#fb923c"],
                        ["gym",    "Rec & gym",    "#38bdf8"],
                        ["brain",  "Team meeting", "#a78bfa"],
                      ] as [RoutingDestination, string, string][]
                    ).map(([dest, label, dot]) => (
                      <motion.button
                        key={dest}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => onRouteAgent(agent.id, dest)}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-2 text-left text-[11px] font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dot }} />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </section>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
