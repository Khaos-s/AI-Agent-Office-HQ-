"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoomLocation, AgentProfile } from "@/types";
import { Brain, ChevronDown, X } from "lucide-react";

const NAV_ROOMS: { id: RoomLocation; label: string }[] = [
  { id: "overview",    label: "Overview"      },
  { id: "focus_work",  label: "Focus Work"    },
  { id: "all_hands",   label: "All Hands"     },
  { id: "pantry",      label: "Pantry"        },
  { id: "gym",         label: "Rec & Gym"     },
];

interface HQHeaderProps {
  currentRoom: RoomLocation;
  onRoomSelect: (room: RoomLocation) => void;
  totalAgents: number;
  onOpenBrainVault: () => void;
  agents: AgentProfile[];
  onSelectAgent: (agent: AgentProfile) => void;
  pendingApprovals: number;
  onOpenApprovals: () => void;
}

export const HQHeader: React.FC<HQHeaderProps> = ({
  currentRoom,
  onRoomSelect,
  totalAgents,
  onOpenBrainVault,
  agents,
  onSelectAgent,
  pendingApprovals,
  onOpenApprovals,
}) => {
  const [time, setTime] = useState("");
  const [rosterOpen, setRosterOpen] = useState(false);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: true }) + " PHT");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-40 flex h-11 shrink-0 min-w-0 items-center justify-between border-b border-white/[0.07] bg-[#07090f]/90 px-3 gap-2 backdrop-blur-md"
    >
      {/* LEFT — Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-sky-500/20 ring-1 ring-sky-500/40">
          <span className="text-[9px] font-black tracking-tight text-sky-300">HQ</span>
        </div>
        <div className="hidden xl:block">
          <span className="text-[11px] font-semibold uppercase tracking-[.18em] text-slate-100">
            EasyUp Software Solution
          </span>
          <span className="ml-2 text-[9px] text-slate-500">// AGENT OFFICE</span>
        </div>
      </div>

      {/* CENTER — Room nav */}
      <nav aria-label="Campus rooms" className="hidden lg:flex items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-0.5">
        {NAV_ROOMS.map((room) => {
          const active = currentRoom === room.id;
          return (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room.id)}
              className="relative px-3 py-1 text-[11px] font-medium transition"
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md bg-sky-500/20 ring-1 ring-sky-500/40"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${active ? "text-sky-200" : "text-slate-500 hover:text-slate-200"}`}>
                {room.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* RIGHT — Clock, Brain, Agents, HITL */}
      <div className="flex items-center gap-2">
        {/* Live clock */}
        <span className="hidden select-none flex-col items-end leading-tight 2xl:flex">
          <span className="text-[11px] font-mono text-slate-200">{time}</span>
          <span className="text-[9px] font-mono text-sky-500/80 tracking-widest">1× PACE</span>
        </span>

        {/* Brain vault */}
        <button
          onClick={onOpenBrainVault}
          className="flex items-center gap-1.5 rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 min-h-9 py-1 text-[10px] font-semibold text-sky-300 transition hover:bg-sky-500/20"
        >
          <Brain className="h-3 w-3" />
          Brain Vault
        </button>

        {/* Pending approvals badge */}
        <AnimatePresence>
          {pendingApprovals > 0 && (
            <motion.button
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={onOpenApprovals}
              className="flex items-center gap-1 rounded-md bg-rose-500/20 px-2 min-h-9 py-1 text-[10px] font-bold text-rose-200 ring-1 ring-rose-500/40 transition hover:bg-rose-500/30"
            >
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-rose-400" />
              {pendingApprovals} pending
            </motion.button>
          )}
        </AnimatePresence>

        {/* Agents roster dropdown */}
        <div className="relative">
          <button
            onClick={() => setRosterOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 min-h-9 py-1 text-[10px] font-semibold text-slate-300 transition hover:bg-white/[0.07]"
          >
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime-400" />
            {totalAgents} Agents
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          <AnimatePresence>
            {rosterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-1.5 w-64 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d1117] shadow-2xl"
              >
                <div className="border-b border-white/[0.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                  Campus Roster ({agents.length})
                </div>
                <div className="slim-scroll max-h-72 overflow-y-auto py-1">
                  {agents.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { onSelectAgent(a); setRosterOpen(false); }}
                      className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition hover:bg-white/[0.04]"
                    >
                      <span className="flex items-center gap-2 text-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
                        {a.name}
                      </span>
                      <span className="text-[9px] capitalize text-slate-500">{a.currentRoom.replace(/_/g, " ")}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};
