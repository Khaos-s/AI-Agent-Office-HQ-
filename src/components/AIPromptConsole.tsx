"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentProfile } from "@/types";
import {
  Send,
  Sparkles,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Terminal,
  Cpu,
} from "lucide-react";

interface AIPromptConsoleProps {
  agent: AgentProfile;
  onSuccess?: (agent: AgentProfile, responseMsg: string) => void;
  onOpenApprovals?: () => void;
  compact?: boolean;
}

// Quick action templates tailored per department
const DEPARTMENT_PROMPTS: Record<string, string[]> = {
  Executive: [
    "Align cross-department sprint deliverables at The Brain",
    "Audit Dual-System Brain invariants and SLOs",
    "Coordinate all-hands architecture review",
  ],
  "Systems Design": [
    "Design distributed state machine and failure domains",
    "Validate offline sync contracts and idempotency keys",
  ],
  Database: [
    "Analyze slow queries and optimize PostgreSQL indexes",
    "Verify schema migration contracts and RLS policies",
  ],
  Security: [
    "Run automated threat model and secret isolation audit",
    "Verify Zero-Trust client/server boundary enforcement",
  ],
  Engineering: [
    "Run Vitest test suite and verify isolated worktree",
    "Optimize canvas rendering frame budget for 60 FPS",
    "Harden REST API route handler validation schemas",
  ],
  Quality: [
    "Execute boundary test cases in the scenario bank",
    "Verify regression gates on master branch",
  ],
  DevOps: [
    "Inspect Vercel edge container health and proxies",
    "Audit environment variable secret boundaries",
  ],
  Research: [
    "Scan GitHub Radar for trending open-source AI frameworks",
    "Analyze star velocity and score repository freshness",
  ],
  Analytics: [
    "Extract daily agent compute metrics and SLA latency curves",
    "Generate executive telemetry dashboard report",
  ],
  Documentation: [
    "Audit developer guide documentation and API endpoints",
    "Draft comprehensive tutorial for office-v3 deployment",
  ],
  Content: [
    "Draft high-conversion product launch copy and slogans",
    "Compose brand mission narrative update",
  ],
  Growth: [
    "Analyze organic user acquisition and retention funnels",
    "Audit search index visibility and conversion curves",
  ],
  Creative: [
    "Render programmatic Remotion video export pipeline",
    "Compose 60 FPS motion graphics scene transitions",
  ],
  Performance: [
    "Profile agent memory caches and system endurance",
    "Execute stress test under 1,000 simulated requests",
  ],
  Support: [
    "Log community feature requests and triage bug reports",
    "Analyze customer satisfaction metrics across channels",
  ],
  Communications: [
    "Triage inbound sponsor and partner inquiries",
    "Prepare correspondence draft for executive review",
  ],
  Commerce: [
    "Verify e-commerce order fulfillment queue",
    "Stage high-risk customer refund (HITL Gate)",
  ],
};

export const AIPromptConsole: React.FC<AIPromptConsoleProps> = ({
  agent,
  onSuccess,
  onOpenApprovals,
  compact = false,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [isHITL, setIsHITL] = useState(false);

  const quickPrompts = DEPARTMENT_PROMPTS[agent.department] || [
    `Execute core ${agent.department} task autonomously`,
    "Report current status and blocker analysis",
  ];

  const handleSubmit = async (customPrompt?: string) => {
    const textToSubmit = customPrompt || prompt;
    if (!textToSubmit.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setLastResponse(null);
    setIsHITL(false);

    try {
      const res = await fetch("/api/agent/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          prompt: textToSubmit,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLastResponse(data.response);
        setIsHITL(!!data.requiresHITL);
        if (onSuccess && data.agent) {
          onSuccess(data.agent, data.response);
        }
      } else {
        setLastResponse(`Error: ${data.error || "Failed to dispatch prompt."}`);
      }
    } catch {
      setLastResponse("Network error: Unable to contact Antigravity AI Bridge.");
    } finally {
      setIsSubmitting(false);
      if (!customPrompt) setPrompt("");
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-1.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Prompt @${agent.name} (e.g. "Run tests")...`}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/[0.08] bg-[#050811] px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition focus:border-sky-400/50"
            />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isSubmitting}
            className="flex items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-500/30 disabled:opacity-40"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>
        </form>

        {/* Quick pills */}
        <div className="flex flex-wrap gap-1">
          {quickPrompts.slice(0, 2).map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSubmit(qp)}
              disabled={isSubmitting}
              className="truncate rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] text-slate-400 transition hover:border-sky-400/30 hover:text-sky-300 disabled:opacity-40"
              title={qp}
            >
              ⚡ {qp}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-sky-500/20 bg-[#090d16] p-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-sky-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
            AI Prompt Console // Antigravity Bridge
          </span>
        </div>
        <span className="flex items-center gap-1 rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-sky-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
          <Cpu className="h-2.5 w-2.5" />
          {agent.modelTier.toUpperCase()} ONLINE
        </span>
      </div>

      {/* Quick suggestions */}
      <div className="mt-3">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
          Quick Directives (@{agent.name})
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSubmit(qp)}
              disabled={isSubmitting}
              className="flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-left text-[10px] text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-200 disabled:opacity-40"
            >
              <Sparkles className="h-2.5 w-2.5 text-sky-400" />
              <span>{qp}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-3"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Instruct @${agent.name} directly...`}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-white/[0.08] bg-[#050811] py-2 pl-3 pr-20 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-sky-400/60"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isSubmitting}
            className="absolute right-1.5 flex items-center gap-1 rounded-md border border-sky-400/30 bg-sky-500/20 px-2.5 py-1 text-[11px] font-semibold text-sky-200 transition hover:bg-sky-500/30 disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Thinking</span>
              </>
            ) : (
              <>
                <Send className="h-3 w-3" />
                <span>Dispatch</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Response Box */}
      <AnimatePresence>
        {lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`mt-3 rounded-lg border p-2.5 text-xs leading-relaxed ${
              isHITL
                ? "border-amber-500/30 bg-amber-500/[0.06] text-amber-200"
                : "border-sky-500/20 bg-sky-500/[0.05] text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between pb-1 text-[10px] font-bold">
              <span className="flex items-center gap-1.5">
                {isHITL ? (
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                )}
                {isHITL ? "HUMAN-IN-THE-LOOP GATE TRIGGERED" : "AI RECEIPT"}
              </span>
              <span className="text-slate-500 font-mono">@{agent.id}</span>
            </div>

            <p className="mt-1 text-[11px] text-slate-300">{lastResponse}</p>

            {isHITL && onOpenApprovals && (
              <button
                type="button"
                onClick={onOpenApprovals}
                className="mt-2 flex items-center gap-1 rounded bg-amber-500/20 px-2 py-1 text-[10px] font-semibold text-amber-200 hover:bg-amber-500/30"
              >
                Review in The Boss Desk →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

