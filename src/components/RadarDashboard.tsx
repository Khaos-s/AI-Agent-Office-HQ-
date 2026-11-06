"use client";

import React, { useState } from "react";
import { RadarItem, RadarTopic } from "@/types";
import { Radar, ExternalLink, Star, TrendingUp, Sparkles, RefreshCw } from "lucide-react";

interface RadarDashboardProps {
  items: RadarItem[];
  onTriggerScan: () => Promise<void>;
  isLoading: boolean;
  lastScannedAt?: string;
}

export const RadarDashboard: React.FC<RadarDashboardProps> = ({
  items,
  onTriggerScan,
  isLoading,
  lastScannedAt,
}) => {
  const [topicFilter, setTopicFilter] = useState<RadarTopic | "all">("all");

  const filteredItems =
    topicFilter === "all" ? items : items.filter((item) => item.topic === topicFilter);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (score >= 65) return "text-sky-400 bg-sky-500/10 border-sky-500/30";
    if (score >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-slate-400 bg-slate-800 border-slate-700";
  };

  const getTopicBadge = (topic: RadarTopic) => {
    switch (topic) {
      case "ai-agents":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "memory":
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "video":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "voice":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Radar className="w-5 h-5 text-emerald-400" />
            GitHub Radar (Autonomous Tech Discovery)
          </h2>
          <p className="text-xs text-slate-400">
            Daily 6:00 AM Discovery Routine: Scored by Stars Growth (40%), Topic Relevance (40%), and Freshness (20%).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastScannedAt && (
            <span className="text-[11px] font-mono text-slate-500">
              Scanned: {new Date(lastScannedAt).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onTriggerScan}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Scanning GitHub..." : "Run Radar Routine"}</span>
          </button>
        </div>
      </div>

      {/* Topics Tabs */}
      <div className="flex items-center space-x-2 my-4 text-xs font-mono overflow-x-auto pb-1">
        <button
          onClick={() => setTopicFilter("all")}
          className={`px-3 py-1 rounded transition-all ${
            topicFilter === "all"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
              : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          All Topics ({items.length})
        </button>
        <button
          onClick={() => setTopicFilter("ai-agents")}
          className={`px-3 py-1 rounded transition-all ${
            topicFilter === "ai-agents"
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold"
              : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          AI Agents
        </button>
        <button
          onClick={() => setTopicFilter("memory")}
          className={`px-3 py-1 rounded transition-all ${
            topicFilter === "memory"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold"
              : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Memory
        </button>
        <button
          onClick={() => setTopicFilter("video")}
          className={`px-3 py-1 rounded transition-all ${
            topicFilter === "video"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold"
              : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setTopicFilter("voice")}
          className={`px-3 py-1 rounded transition-all ${
            topicFilter === "voice"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
              : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Voice
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 font-mono text-xs font-bold text-slate-400 border border-slate-800">
                #{index + 1}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-slate-100 hover:text-sky-400 flex items-center gap-1 transition-colors"
                  >
                    <span>{item.repo}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-medium ${getTopicBadge(
                      item.topic
                    )}`}
                  >
                    {item.topic}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/60 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{item.stars.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{item.starsGrowth}/wk</span>
              </div>

              <div
                className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-1.5 ${getScoreColor(
                  item.score
                )}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Radar Score: {item.score}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

