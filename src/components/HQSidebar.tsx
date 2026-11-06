"use client";

import React from "react";
import { AgentProfile, CampusStats, RoutingDestination } from "@/types";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface HQSidebarProps {
  stats: CampusStats;
  agents: AgentProfile[];
  selectedAgent: AgentProfile | null;
  onSelectAgent: (agent: AgentProfile) => void;
  onRouteAgent: (agentId: string, destination: RoutingDestination) => void;
  onOpenApprovals: () => void;
  onTriggerTestHITL?: () => void;
}

export const HQSidebar: React.FC<HQSidebarProps> = ({
  stats,
  agents,
  selectedAgent,
  onSelectAgent,
  onRouteAgent,
  onOpenApprovals,
  onTriggerTestHITL,
}) => {
  const currentAgent = selectedAgent || agents[0];

  const getStatusPill = (status: string) => {
    switch (status) {
      case "working":
        return { label: "Working at Desk", bg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-400" };
      case "eating":
        return { label: "Eating in Pantry", bg: "bg-orange-950/80 border-orange-500/40 text-orange-400" };
      case "gym":
        return { label: "Gym / Rec Break", bg: "bg-sky-950/80 border-sky-500/40 text-sky-400" };
      case "meeting":
        return { label: "In Scrum at The Brain", bg: "bg-purple-950/80 border-purple-500/40 text-purple-400" };
      case "break":
        return { label: "On Team Break", bg: "bg-amber-950/80 border-amber-500/40 text-amber-400" };
      case "waiting_approval":
        return { label: "Waiting on You (HITL)", bg: "bg-rose-950/80 border-rose-500/40 text-rose-400 animate-pulse" };
      default:
        return { label: "Active", bg: "bg-slate-900 border-slate-700 text-slate-300" };
    }
  };

  const pill = currentAgent ? getStatusPill(currentAgent.status) : null;

  // Alphabetically sorted agents to match screenshot order (Anthony, Arwin, Blaze, Bonnie...)
  const sortedAgents = [...agents].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <aside className="w-full xl:w-96 flex flex-col space-y-4 font-mono text-xs">
      {/* 1. CAMPUS LIVE COUNTER (Matches Screenshot Exact Layout) */}
      <div className="bg-[#050b14] border border-cyan-950 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
          <h2 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            CAMPUS LIVE COUNTER
          </h2>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            {stats.total} ONLINE
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>WORKING</span>
            </span>
            <span className="font-bold text-emerald-400">{stats.working}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>EATING</span>
            </span>
            <span className="font-bold text-orange-400">{stats.eating}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>IN THE GYM</span>
            </span>
            <span className="font-bold text-sky-400">{stats.gym}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>IN MEETING</span>
            </span>
            <span className="font-bold text-purple-400">{stats.meeting}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>ON BREAK</span>
            </span>
            <span className="font-bold text-amber-400">{stats.breakCount}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>ARRIVING</span>
            </span>
            <span className="font-bold text-slate-400">{stats.arriving}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>WAITING ON YOU</span>
            </span>
            <span
              className={`font-bold ${
                stats.waitingApproval > 0
                  ? "text-rose-400 font-extrabold animate-bounce"
                  : "text-slate-400"
              }`}
            >
              {stats.waitingApproval}
            </span>
          </div>
        </div>

        {/* Tasks and Accessories */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400">
          <div>
            OPEN TASKS: <span className="font-bold text-slate-200">{stats.openTasks}</span>
          </div>
          <div>
            ACCESSORIES: <span className="font-bold text-slate-200">{stats.accessories}</span>
          </div>
        </div>
      </div>

      {/* 2. THE BOSS DESK // APPROVALS */}
      <div className="bg-[#050b14] border border-cyan-950 rounded-2xl p-4 shadow-xl transition-all">
        <div
          onClick={onOpenApprovals}
          className="flex items-center justify-between mb-2 cursor-pointer group"
        >
          <h2 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            THE BOSS DESK // APPROVALS
          </h2>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase transition-all ${
              stats.waitingApproval > 0
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
                : "bg-amber-950/60 text-amber-300 border-amber-500/30"
            }`}
          >
            {stats.waitingApproval} PENDING
          </span>
        </div>

        <p
          onClick={onOpenApprovals}
          className="text-[11px] text-slate-400 leading-snug cursor-pointer hover:text-slate-200 transition-colors"
        >
          {stats.waitingApproval > 0
            ? `${stats.waitingApproval} sensitive operations hold for human sign-off. Click to inspect & approve.`
            : "All Go-Signals cleared. Operations running nominal."}
        </p>

        {/* Test High-Risk Action Button */}
        {onTriggerTestHITL && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTriggerTestHITL();
              }}
              className="text-[9px] text-amber-400/90 hover:text-amber-300 flex items-center gap-1 bg-amber-950/40 hover:bg-amber-950/70 px-2 py-1 rounded border border-amber-500/30 transition-all"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Simulate High-Risk Action (HITL Gate)</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. AGENT INSPECTOR & ROUTING */}
      <div className="bg-[#050b14] border border-cyan-950 rounded-2xl p-4 shadow-xl flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
            <h2 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              AGENT INSPECTOR & ROUTING
            </h2>
            <span className="text-[10px] text-cyan-400 font-bold">
              All Agents ({agents.length}) =
            </span>
          </div>

          {/* Horizontal Agent Selector Chips (Alphabetical: Anthony, Arwin, Blaze, Bonnie...) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin">
            {sortedAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className={`px-2 py-1 rounded text-[10px] whitespace-nowrap transition-all flex items-center gap-1 ${
                  currentAgent?.id === agent.id
                    ? "bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: agent.color }}
                ></span>
                <span>{agent.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Agent Card (Matches Screenshot) */}
          {currentAgent && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-xs bg-gradient-to-br from-indigo-500 to-purple-600"
                  >
                    {currentAgent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-100">{currentAgent.name}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono">
                        {currentAgent.shortRole || currentAgent.modelTier.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{currentAgent.role}</p>
                  </div>
                </div>

                {pill && (
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${pill.bg}`}>
                    {pill.label}
                  </span>
                )}
              </div>

              {/* Direct Individual Routing (A* Walking) Buttons */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="text-[9px] text-cyan-400 font-bold tracking-wider uppercase mb-2">
                  DIRECT INDIVIDUAL ROUTING (A* WALKING):
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onRouteAgent(currentAgent.id, "desk")}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-[10px] text-slate-200 hover:text-emerald-300 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Send to Work Desk</span>
                  </button>

                  <button
                    onClick={() => onRouteAgent(currentAgent.id, "pantry")}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-slate-900 hover:bg-orange-950/60 border border-slate-800 hover:border-orange-500/50 text-[10px] text-slate-200 hover:text-orange-300 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span>Send to Pantry / Coffee</span>
                  </button>

                  <button
                    onClick={() => onRouteAgent(currentAgent.id, "gym")}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-slate-900 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/50 text-[10px] text-slate-200 hover:text-sky-300 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span>Send to Gym / Rec</span>
                  </button>

                  <button
                    onClick={() => onRouteAgent(currentAgent.id, "brain")}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/50 text-[10px] text-slate-200 hover:text-purple-300 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Call to Brain (Scrum)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Task Status */}
        {currentAgent && (
          <div className="mt-2 text-[10px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-slate-500 uppercase font-bold">CURRENT TASK:</span>{" "}
            <span className="text-slate-200">{currentAgent.currentTask}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
