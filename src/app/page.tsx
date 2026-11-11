"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AgentProfile,
  HITLApproval,
  RoomLocation,
  CampusStats,
  RoutingDestination,
} from "@/types";
import { INITIAL_24_AGENTS } from "@/lib/agent-registry";
import { HQHeader }        from "@/components/HQHeader";
import { CampusViewport }  from "@/components/CampusViewport";
import { HQSidebar }       from "@/components/HQSidebar";
import { HITLQueueModal }  from "@/components/HITLQueueModal";
import { BrainVaultModal } from "@/components/BrainVaultModal";
import { AgentDetailModal } from "@/components/AgentDetailModal";
import { FloatingAgentCommandDock } from "@/components/FloatingAgentCommandDock";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Notif = { id: number; msg: string; ok: boolean };

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connectionState, setConnectionState] = useState<"loading" | "ready" | "stale">("loading");
  const [serverOffset, setServerOffset] = useState(0);
  useEffect(() => { setSidebarOpen(window.innerWidth >= 1024); }, []);
  const [currentRoom,   setCurrentRoom]   = useState<RoomLocation>("overview");
  const [agents,        setAgents]        = useState<AgentProfile[]>(INITIAL_24_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(
    INITIAL_24_AGENTS[0] ?? null
  );
  const [approvals,     setApprovals]     = useState<HITLApproval[]>([]);
  const [campusStats,   setCampusStats]   = useState<CampusStats>({
    total: 24,
    working: 6,
    eating: 1,
    gym: 2,
    meeting: 3,
    breakCount: 12,
    arriving: 0,
    waitingApproval: 0,
    openTasks: 8,
    accessories: 13,
  });

  const [approvalsOpen,  setApprovalsOpen]  = useState(false);
  const [brainVaultOpen, setBrainVaultOpen] = useState(false);
  const [detailOpen,     setDetailOpen]     = useState(false);
  const [notifs,         setNotifs]         = useState<Notif[]>([]);
  const notifCounter = React.useRef(0);

  const push = (msg: string, ok = true) => {
    const id = ++notifCounter.current;
    setNotifs((p) => [...p, { id, msg, ok }]);
    setTimeout(() => setNotifs((p) => p.filter((n) => n.id !== id)), 4000);
  };

  // ── Server sync ───────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [offRes, appRes] = await Promise.all([
        fetch("/api/office/state").then((r) => r.json()),
        fetch("/api/approvals").then((r) => r.json()),
      ]);
      if (offRes.success && offRes.agents) {
        setAgents(offRes.agents);
        setConnectionState("ready");
        if (offRes.timestamp) setServerOffset(Date.parse(offRes.timestamp) - Date.now());
        if (offRes.campusStats) setCampusStats(offRes.campusStats);
      }
      if (!offRes.success) setConnectionState("stale");
      if (appRes.success && appRes.approvals) setApprovals(appRes.approvals);
    } catch {
      setConnectionState("stale");
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 2500);
    return () => clearInterval(id);
  }, [fetchData]);

  // Keep selectedAgent synchronized
  useEffect(() => {
    if (!agents.length) { setSelectedAgent(null); return; }
    if (selectedAgent) {
      const up = agents.find((a) => a.id === selectedAgent.id);
      setSelectedAgent(up ?? agents[0]);
    } else if (agents.length) {
      setSelectedAgent(agents.find((a) => a.id === "josiah") ?? agents[0]);
    }
  }, [agents, selectedAgent]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRoute = async (agentId: string, dest: RoutingDestination) => {
    try {
      const res = await fetch("/api/office/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agentId, destination: dest }),
      }).then((r) => r.json());

      if (res.success) {
        setAgents((p) => p.map((a) => (a.id === agentId ? res.agent : a)));
        push(`@${agentId} is walking to ${dest.toUpperCase()}`);
        fetchData();
      } else { push(res.error || "Could not move this agent.", false); }
    } catch (e) {
      push("Could not reach the campus. Please try again.", false);
    }
  };

  const handleMoveXY = async (agentId: string, x: number, y: number) => {
    try {
      const res = await fetch("/api/office/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agentId, targetCoordinates: { x, y } }),
      }).then((r) => r.json());

      if (res.success) {
        setAgents((p) => p.map((a) => (a.id === agentId ? res.agent : a)));
        push(`@${agentId} is walking to the selected position`);
        fetchData();
      } else { push(res.error || "Could not move this agent.", false); }
    } catch (e) {
      push("Could not reach the campus. Please try again.", false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: string,
    currentTask?: string,
    speechBubble?: string
  ) => {
    try {
      const res = await fetch("/api/office/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, currentTask, speechBubble }),
      }).then((r) => r.json());

      if (res.success) {
        setAgents((p) => p.map((a) => (a.id === id ? res.agent : a)));
        push(`Updated @${id} status`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerHITL = async (agentId: string) => {
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          actionType: "shopify_refund",
          title: "Sensitive Action: High-Risk Refund",
          description: "Customer refund request >$100 requiring Dual-Operator sign-off",
          riskLevel: "high",
          payload: { orderId: "5082", amount: 145.0, currency: "USD" },
        }),
      }).then((r) => r.json());

      if (res.success) {
        await handleUpdateStatus(
          agentId,
          "waiting_approval",
          "Awaiting operator sign-off in The Boss Desk",
          "Action held at HITL gate!"
        );
        push(`Action queued at The Boss Desk for @${agentId}`);
        setApprovalsOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveApproval = async (
    id: string,
    action: "approve" | "reject",
    comment?: string
  ) => {
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewer: "Operator", comment }),
      }).then((r) => r.json());

      if (res.success) {
        push(`Approval action ${action}ed`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePromptSuccess = (updatedAgent: AgentProfile, responseMsg: string) => {
    setAgents((prev) => prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)));
    setSelectedAgent(updatedAgent);
    push(`@${updatedAgent.name}: ${responseMsg.length > 45 ? responseMsg.substring(0, 42) + "..." : responseMsg}`);
    fetchData();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#07090f]">
      {/* Slim header — 44 px */}
      <HQHeader
        currentRoom={currentRoom}
        onRoomSelect={setCurrentRoom}
        totalAgents={campusStats.total}
        onOpenBrainVault={() => setBrainVaultOpen(true)}
        agents={agents}
        onSelectAgent={setSelectedAgent}
        pendingApprovals={campusStats.waitingApproval}
        onOpenApprovals={() => setApprovalsOpen(true)}
      />

      {/* Full-bleed campus canvas fills everything below header */}
      <main className="relative flex-1 min-h-0 w-full overflow-hidden">
        <div className={`h-full ${sidebarOpen ? "lg:pr-80" : ""}`}>
        <div className="relative h-full">
        <CampusViewport
          connectionState={connectionState}
          serverOffset={serverOffset}
          currentRoom={currentRoom}
          agents={agents}
          selectedAgentId={selectedAgent?.id ?? null}
          onSelectAgent={(a) => {
            if (a) setSelectedAgent(a);
          }}
          onRoomChange={setCurrentRoom}
          onMoveAgentDirectly={handleMoveXY}
        />

        {/* Floating Quick Command Dock */}
        <FloatingAgentCommandDock
          agent={selectedAgent}
          onSuccess={handlePromptSuccess}
          onOpenApprovals={() => setApprovalsOpen(true)}
          onOpenDetail={() => setDetailOpen(true)}
        />

        </div>
        </div>

        {/* Slide-over command panel */}
        <HQSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          stats={campusStats}
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          onRouteAgent={handleRoute}
          onOpenApprovals={() => setApprovalsOpen(true)}
          onTriggerTestHITL={() => handleTriggerHITL(selectedAgent?.id ?? "gabriel")}
          onPromptSuccess={handlePromptSuccess}
        />
      </main>

      {/* ── Toast stack ──────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {notifs.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md ${
                n.ok
                  ? "border-lime-300/30 bg-slate-950/90 text-lime-300 shadow-lime-950/50"
                  : "border-rose-300/30 bg-slate-950/90 text-rose-300 shadow-rose-950/50"
              }`}
            >
              {n.ok ? (
                <CheckCircle2 className="h-4 w-4 text-lime-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400" />
              )}
              {n.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {approvalsOpen && (
          <motion.div
            key="approvals-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-4xl"
            >
              <button
                onClick={() => setApprovalsOpen(false)}
                className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#17212b] text-white shadow-lg transition hover:bg-white/10"
              >
                ✕
              </button>
              <HITLQueueModal
                approvals={approvals}
                onResolve={handleResolveApproval}
                isLoading={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BrainVaultModal isOpen={brainVaultOpen} onClose={() => setBrainVaultOpen(false)} />

      {detailOpen && selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setDetailOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          onTriggerHITL={handleTriggerHITL}
        />
      )}
    </div>
  );
}
