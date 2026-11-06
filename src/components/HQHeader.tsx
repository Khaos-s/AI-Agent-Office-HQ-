"use client";

import React, { useState, useEffect } from "react";
import { RoomLocation } from "@/types";
import { Brain, Layers } from "lucide-react";

interface HQHeaderProps {
  currentRoom: RoomLocation;
  onRoomSelect: (room: RoomLocation) => void;
  viewMode: "2d" | "3d";
  onToggleViewMode: (mode: "2d" | "3d") => void;
  totalAgents: number;
  onOpenBrainVault: () => void;
}

export const HQHeader: React.FC<HQHeaderProps> = ({
  currentRoom,
  onRoomSelect,
  viewMode,
  onToggleViewMode,
  totalAgents,
  onOpenBrainVault,
}) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: true }) + " PHT");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#050b14]/95 border-b border-cyan-950/80 px-4 py-2.5 sticky top-0 z-40 backdrop-blur-md">
      <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Left: Organization Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold shadow-lg shadow-cyan-950/50 text-base">
            HQ
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>EASYUP SOFTWARE SOLUTION // HQ COMMAND</span>
            </h1>
            <p className="text-[10px] text-cyan-400/80 font-mono tracking-wide">
              ILOILO CITY • BRANCH: <span className="text-cyan-300">office-v3</span>
            </p>
          </div>
        </div>

        {/* Center: Navigation Room Pills */}
        <nav className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-mono overflow-x-auto">
          <button
            onClick={() => onRoomSelect("overview")}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRoom === "overview"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => onRoomSelect("focus_work")}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRoom === "focus_work"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            FOCUS WORK
          </button>
          <button
            onClick={() => onRoomSelect("all_hands")}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRoom === "all_hands"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            ALL HANDS
          </button>
          <button
            onClick={() => onRoomSelect("pantry")}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRoom === "pantry"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            PANTRY & CANTEEN
          </button>
          <button
            onClick={() => onRoomSelect("gym")}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentRoom === "gym"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            REC & GYM
          </button>
        </nav>

        {/* Right: Real-time pace, Roster & 3D/2D Toggle */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-slate-200 font-bold text-[11px]">{time || "10:28:14 PM PHT"}</span>
            <span className="text-[9px] text-cyan-400 uppercase tracking-widest">
              1x REAL-TIME WORK PACE
            </span>
          </div>

          <button
            onClick={onOpenBrainVault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/70 border border-sky-500/40 text-sky-300 hover:bg-sky-900/60 transition-all text-xs font-bold shadow-md"
          >
            <Brain className="w-3.5 h-3.5 text-sky-400" />
            <span>BRAIN VAULT</span>
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-bold text-xs flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{totalAgents} AGENTS ROSTER</span>
          </div>

          {/* 3D / 2D Toggle Switcher (Matching Screenshot) */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => onToggleViewMode("3d")}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                viewMode === "3d"
                  ? "bg-cyan-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              3D View
            </button>
            <button
              onClick={() => onToggleViewMode("2d")}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                viewMode === "2d"
                  ? "bg-cyan-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              2D View
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

