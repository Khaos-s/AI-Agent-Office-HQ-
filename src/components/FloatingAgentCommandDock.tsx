"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentProfile } from "@/types";
import { Send, Loader2, Sparkles, ShieldAlert, Cpu } from "lucide-react";

interface FloatingAgentCommandDockProps {
  agent: AgentProfile | null;
  onSuccess?: (agent: AgentProfile, responseMsg: string) => void;
  onOpenApprovals?: () => void;
  onOpenDetail?: () => void;
}

const QUICK_ACTIONS: Record<string, string[]> = {
  Executive: ["Align sprint deliverables at The Brain", "Audit Dual-Brain invariants"],
  "Systems Design": ["Design failure domains and state machine", "Audit offline sync keys"],
  Database: ["Analyze slow queries & optimize indexes", "Verify PostgreSQL RLS policies"],
  Security: ["Run automated threat model audit", "Verify client/server token isolation"],
  Engineering: ["Run Vitest test suite and report coverage", "Optimize canvas rendering loop"],
  Quality: ["Execute regression tests on master", "Run boundary scenario bank"],
  DevOps: ["Inspect Vercel edge container health", "Audit environment boundaries"],
  Research: ["Scan GitHub Radar for trending AI repos", "Score repo freshness velocity"],
  Analytics: ["Extract daily agent compute metrics", "Generate telemetry report"],
  Documentation: ["Audit developer guides & tutorials", "Verify API spec endpoints"],
  Content: ["Draft high-conversion launch copy", "Write brand story update"],
  Growth: ["Analyze user retention and growth curves", "Audit organic search funnels"],
  Creative: ["Render programmatic Remotion pipeline", "Verify 60 FPS motion graphics"],
  Performance: ["Profile agent memory endurance", "Execute stress test simulation"],
  Support: ["Log community bug reports", "Analyze customer satisfaction"],
  Communications: ["Triage partner and sponsor inquiries", "Prepare executive draft"],
  Commerce: ["Verify store fulfillment queue", "Stage high-risk refund (HITL)"],
};

export const FloatingAgentCommandDock: React.FC<FloatingAgentCommandDockProps> = ({
  agent,
  onSuccess,
  onOpenApprovals,
  onOpenDetail,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPills, setShowPills] = useState(false);

  if (!agent) return null;

  const quicks = QUICK_ACTIONS[agent.department] || [
    `Execute core ${agent.department} task`,
    "Report status and blockers",
  ];

  const handleDispatch = async (textToSubmit?: string) => {
    const finalPrompt = textToSubmit || prompt;
    if (!finalPrompt.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/agent/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          prompt: finalPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.agent) {
        if (onSuccess) {
          onSuccess(data.agent, data.response);
        }
        if (data.requiresHITL && onOpenApprovals) {
          onOpenApprovals();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setPrompt("");
      setShowPills(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center">
      <AnimatePresence>
        {showPills && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="pointer-events-auto mb-2 flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-sky-500/20 bg-[#080d19]/95 p-2 shadow-2xl backdrop-blur-md"
          >
            <span className="text-[10px] font-mono text-slate-400 pl-1 pr-1.5">
              Quick prompts:
            </span>
            {quicks.map((q, i) => (
              <button
                key={i}
                onClick={() => handleDispatch(q)}
                disabled={isSubmitting}
                className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-300 disabled:opacity-40"
              >
                <Sparkles className="h-2.5 w-2.5 text-sky-400" />
                <span>{q}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating dock bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-sky-500/30 bg-[#080d19]/90 p-1.5 pl-3 pr-2 shadow-2xl backdrop-blur-xl ring-1 ring-sky-500/20"
      >
        {/* Agent badge */}
        <button
          onClick={onOpenDetail}
          title="Inspect agent details and system prompt"
          className="group flex items-center gap-2 rounded-xl bg-white/[0.03] px-2.5 py-1.5 transition hover:bg-white/[0.08]"
        >
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow"
            style={{ backgroundColor: agent.color }}
          >
            {agent.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="flex items-center gap-1 text-[11px] font-bold leading-tight text-slate-100 group-hover:text-sky-300">
              @{agent.name}
              <span className="text-[9px] font-mono text-slate-500">
                ({agent.shortRole || agent.role})
              </span>
            </span>
            <span className="flex items-center gap-1 text-[9px] font-mono text-sky-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Connected to AI • {agent.modelTier.toUpperCase()}
            </span>
          </div>
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-white/[0.08]" />

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDispatch();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Instruct @${agent.name} (e.g. "Run tests", "Deploy")...`}
            disabled={isSubmitting}
            className="w-64 rounded-xl border border-white/[0.08] bg-[#03060d] px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-400/60 focus:w-80"
          />

          <button
            type="button"
            onClick={() => setShowPills((v) => !v)}
            title="Toggle quick suggestions"
            className={`flex items-center justify-center rounded-xl border p-1.5 transition ${
              showPills
                ? "border-sky-400/50 bg-sky-500/20 text-sky-300"
                : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4" />
          </button>

          <button
            type="submit"
            disabled={!prompt.trim() || isSubmitting}
            className="flex items-center gap-1 rounded-xl border border-sky-400/40 bg-sky-500/25 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/35 disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Dispatch</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

