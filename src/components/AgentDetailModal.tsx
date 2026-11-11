"use client";

import React, { useState } from "react";
import { AgentProfile, AgentStatus } from "@/types";
import { X, ShieldAlert, Cpu, Wrench, Ban, MessageSquare, Play } from "lucide-react";

interface AgentDetailModalProps {
  agent: AgentProfile | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: AgentStatus, task?: string, speech?: string) => Promise<void>;
  onTriggerHITL: (agentId: string) => Promise<void>;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  onClose,
  onUpdateStatus,
  onTriggerHITL,
}) => {
  const [taskInput, setTaskInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!agent) return null;

  const handleSimulateWork = async () => {
    setIsUpdating(true);
    const promptToRun = taskInput.trim() || "Executing autonomous department task";
    try {
      const res = await fetch("/api/agent/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, prompt: promptToRun }),
      });
      const data = await res.json();
      if (data.success && data.agent) {
        await onUpdateStatus(
          agent.id,
          data.agent.status,
          data.agent.currentTask,
          data.agent.speechBubble
        );
      } else {
        await onUpdateStatus(
          agent.id,
          "working",
          promptToRun,
          "Task dispatched. Working at desk."
        );
      }
    } catch {
      await onUpdateStatus(
        agent.id,
        "working",
        promptToRun,
        "Task dispatched. Working at desk."
      );
    }
    setIsUpdating(false);
    setTaskInput("");
  };

  const handleSimulateIdle = async () => {
    setIsUpdating(true);
    await onUpdateStatus(agent.id, "idle", "Standby for new instructions", "Ready.");
    setIsUpdating(false);
  };

  const handleTriggerHITLAction = async () => {
    setIsUpdating(true);
    await onTriggerHITL(agent.id);
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: agent.color }}
            >
              {agent.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{agent.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  @{agent.id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> {agent.modelTier}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {agent.department} • {agent.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Indicator */}
        <div className="my-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-slate-500">Current Status:</span>{" "}
            <span
              className={`font-bold uppercase ${
                agent.status === "working"
                  ? "text-emerald-400"
                  : agent.status === "waiting_approval" || (agent.status as string) === "awaiting_approval"
                  ? "text-amber-400"
                  : "text-slate-300"
              }`}
            >
              {agent.status.replace("_", " ")}
            </span>
          </div>
          {agent.speechBubble && (
            <div className="text-slate-400 italic flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              &quot;{agent.speechBubble}&quot;
            </div>
          )}
        </div>

        {/* 3-Part Brief */}
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg">
            <h4 className="font-mono text-slate-400 uppercase font-bold text-[10px]">
              Who You Are
            </h4>
            <p className="text-slate-200 mt-1">{agent.brief.whoYouAre}</p>
          </div>

          <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg">
            <h4 className="font-mono text-emerald-400 uppercase font-bold text-[10px]">
              What Your Job Is
            </h4>
            <p className="text-slate-200 mt-1">{agent.brief.job}</p>
          </div>

          <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg">
            <h4 className="font-mono text-rose-400 uppercase font-bold text-[10px] flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> What You Must Never Do (Hard Guardrails)
            </h4>
            <p className="text-rose-200/90 mt-1">{agent.brief.mustNeverDo}</p>
          </div>
        </div>

        {/* Tool Allowlists & Disallowlists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2 font-bold text-[11px]">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>Allowed Tools (MCP)</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {agent.allowedTools.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2 font-bold text-[11px]">
              <Ban className="w-3.5 h-3.5 text-rose-400" />
              <span>Disallowed Tools (Blocked)</span>
            </div>
            <ul className="space-y-1 text-rose-300/80 text-[11px]">
              {agent.disallowedTools.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-mono uppercase font-bold text-slate-400">
            Simulate Department Execution
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Assign a task (e.g. Audit pricing changes)..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSimulateWork}
              disabled={isUpdating}
              className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              <span>Assign</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTriggerHITLAction}
              disabled={isUpdating}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30 rounded-lg flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Simulate Sensitive Tool (Trigger HITL Gate)</span>
            </button>

            <button
              onClick={handleSimulateIdle}
              disabled={isUpdating}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Set to Idle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

