"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, BrainCircuit, Radar, LayoutGrid, Clock, RefreshCw } from "lucide-react";

interface NavbarProps {
  activeTab: "office" | "hitl" | "memory" | "radar";
  onTabChange: (tab: "office" | "hitl" | "memory" | "radar") => void;
  pendingApprovalsCount: number;
  activeAgentsCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
  activeAgentsCount,
  onRefresh,
  isRefreshing,
}) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Status */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-lg shadow-lg shadow-indigo-500/20">
            HQ
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI Agent Office
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>{activeAgentsCount} Active Agents</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {time || "00:00:00"}
              </span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onTabChange("office")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "office"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Virtual Office</span>
          </button>

          <button
            onClick={() => onTabChange("hitl")}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "hitl"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>HITL Queue</span>
            {pendingApprovalsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 animate-pulse">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange("memory")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "memory"
                ? "bg-sky-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Shared Brain</span>
          </button>

          <button
            onClick={() => onTabChange("radar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "radar"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>GitHub Radar</span>
          </button>
        </nav>

        {/* Quick Refresh */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sync HQ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

