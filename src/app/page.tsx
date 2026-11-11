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
import { HQHeader }        from "@/components/HQHeader";
import { CampusViewport }  from "@/components/CampusViewport";
import { HQSidebar }       from "@/components/HQSidebar";
import { HITLQueueModal }  from "@/components/HITLQueueModal";
import { BrainVaultModal } from "@/components/BrainVaultModal";
import { AgentDetailModal } from "@/components/AgentDetailModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Notif = { id: number; msg: string; ok: boolean };

export default function Home() {
  const [currentRoom,   setCurrentRoom]   = useState<RoomLocation>("overview");
  const [agents,        setAgents]        = useState<AgentProfile[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
  const [approvals,     setApprovals]     = useState<HITLApproval[]>([]);
  const [campusStats,   setCampusStats]   = useState<CampusStats>({
    total: 24, working: 6, eating: 1, gym: 2, meeting: 3,
    breakCount: 12, arriving: 0, waitingApproval: 0, openTasks: 8, accessories: 13,
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
      if (offRes.success) {
        setAgents(offRes.agents);
        if (offRes.campusStats) setCampusStats(offRes.campusStats);
      }
      if (appRes.success) setApprovals(appRes.approvals);
    } catch { /* network hiccup – keep last state */ }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 2500);
    return () => clearInterval(id);
  }, [fetchData]);

  // Keep selectedAgent in sync with server state
  useEffect(() => {
    if (selectedAgent) {
      const up = agents.find((a) => a.id === selectedAgent.id);
      if (up) setSelectedAgent(up);
    } else if (agents.length) {
      setSelectedAgent(agents.find((a) => a.id === "josiah") ?? agents[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRoute = async (agentId: string, dest: RoutingDestination) => {
    const res  = await fetch("/api/office/state", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agentId, destination: dest }),
    }).then((r) => r.json());
    if (res.success) {
      setAgents((p) => p.map((a) => (a.id === agentId ? res.agent : a)));
      push(`@${agentId} walking to ${dest}`);
      fetchData();
    }
  };

  const handleMoveXY = async (agentId: string, x: number, y: number) => {
    const res = await fetch("/api/office/state", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agentId, targetCoordinates: { x, y } }),
    }).then((r) => r.json());
    if (res.success) {
      setAgents((p) => p.map((a) => (a.id === agentId ? res.agent : a)));
      push(`@${agentId} moving to position`);
      fetchData();
    }
  };

  const handleUpdateStatus = async (
    id: string, status: string, currentTask?: string, speechBubble?: string,
  ) => {
    const res = await fetch("/api/office/state", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, currentTask, speechBubble }),
    }).then((r) => r.json());
    if (res.success) {
      setAgents((p) => p.map((a) => (a.id === id ? res.agent : a)));
      push(`@${id} status updated`);
      fetchData();
    }
  };

  const handleTriggerHITL = async (agentId: string) => {
    const res = await fetch("/api/approvals", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId, actionType: "shopify_refund",
        title: "High-Risk Refund Request",
        description: "Customer refund >$100 requires Dual-Operator sign-off",
        riskLevel: "high",
        payload: { orderId: "5082", amount: 145.0, currency: "USD" },
      }),
    }).then((r) => r.json());
    if (res.success) {
      await handleUpdateStatus(agentId, "waiting_approval", "Waiting at HITL gate", "Action held!");
      push(`Action queued for @${agentId}`);
      setApprovalsOpen(true);
    }
  };

  const handleResolveApproval = async (id: string, action: "approve" | "reject", comment?: string) => {
    const res = await fetch(`/api/approvals/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reviewer: "Operator", comment }),
    }).then((r) => r.json());
    if (res.success) { push(`Approval ${action}d`); fetchData(); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#07090f]">

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
      <div className="relative flex-1 overflow-hidden">
        <CampusViewport
          currentRoom={currentRoom}
          agents={agents}
          selectedAgentId={selectedAgent?.id ?? null}
          onSelectAgent={(a) => { if (a) setSelectedAgent(a); }}
          onRoomChange={setCurrentRoom}
          onMoveAgentDirectly={handleMoveXY}
        />

        {/* Slide-over command panel */}
        <HQSidebar
          stats={campusStats}
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          onRouteAgent={handleRoute}
          onOpenApprovals={() => setApprovalsOpen(true)}
          onTriggerTestHITL={() => handleTriggerHITL(selectedAgent?.id ?? "gabriel")}
        />
      </div>

      {/* ── Toast stack ──────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {notifs.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{   opacity: 0, y: -8, scale: 0.95  }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md ${
                n.ok
                  ? "border-lime-300/20 bg-lime-300/10 text-lime-200"
                  : "border-rose-300/20 bg-rose-300/10 text-rose-200"
              }`}
            >
              {n.ok
                ? <CheckCircle2 className="h-4 w-4 text-lime-400" />
                : <AlertCircle  className="h-4 w-4 text-rose-400" />}
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{   scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-4xl"
            >
              <button
                onClick={() => setApprovalsOpen(false)}
                className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#17212b] text-white shadow-lg transition hover:bg-white/10"
              >✕</button>
              <HITLQueueModal approvals={approvals} onResolve={handleResolveApproval} isLoading={false} />
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
