"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AgentProfile, HITLApproval, RoomLocation, CampusStats, RoutingDestination } from "@/types";
import { HQHeader } from "@/components/HQHeader";
import { CampusViewport } from "@/components/CampusViewport";
import { HQSidebar } from "@/components/HQSidebar";
import { HITLQueueModal } from "@/components/HITLQueueModal";
import { BrainVaultModal } from "@/components/BrainVaultModal";
import { AgentDetailModal } from "@/components/AgentDetailModal";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function Home() {
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [currentRoom, setCurrentRoom] = useState<RoomLocation>("overview");
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
  const [approvals, setApprovals] = useState<HITLApproval[]>([]);
  const [campusStats, setCampusStats] = useState<CampusStats>({
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

  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isBrainVaultOpen, setIsBrainVaultOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync state from server
  const fetchData = useCallback(async () => {
    try {
      const [officeRes, approvalsRes] = await Promise.all([
        fetch("/api/office/state").then((r) => r.json()),
        fetch("/api/approvals").then((r) => r.json()),
      ]);

      if (officeRes.success) {
        setAgents(officeRes.agents);
        if (officeRes.campusStats) {
          setCampusStats(officeRes.campusStats);
        }
      }
      if (approvalsRes.success) {
        setApprovals(approvalsRes.approvals);
      }
    } catch (e) {
      console.error("Failed to fetch office state", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2500);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Keep selected agent synchronized
  useEffect(() => {
    if (selectedAgent) {
      const updated = agents.find((a) => a.id === selectedAgent.id);
      if (updated) setSelectedAgent(updated);
    } else if (agents.length > 0) {
      setSelectedAgent(agents.find((a) => a.id === "josiah") || agents[0]);
    }
  }, [agents, selectedAgent]);

  // Direct Individual Routing (A* Walking)
  const handleRouteAgent = async (agentId: string, destination: RoutingDestination) => {
    try {
      const res = await fetch("/api/office/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agentId, destination }),
      });
      const data = await res.json();
      if (data.success) {
        setAgents((prev) => prev.map((a) => (a.id === agentId ? data.agent : a)));
        showNotification(`Dispatched @${agentId} walking to ${destination.toUpperCase()}.`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Agent Status
  const handleUpdateAgentStatus = async (
    id: string,
    status: any,
    currentTask?: string,
    speechBubble?: string
  ) => {
    try {
      const res = await fetch("/api/office/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, currentTask, speechBubble }),
      });
      const data = await res.json();
      if (data.success) {
        setAgents((prev) => prev.map((a) => (a.id === id ? data.agent : a)));
        showNotification(`Updated @${id} status.`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger HITL Sensitive Operation
  const handleTriggerHITLAction = async (agentId: string) => {
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          actionType: "shopify_refund",
          title: "Sensitive Action: High-Risk Refund",
          description: "Customer refund request over $100 requiring Dual-Operator sign-off",
          riskLevel: "high",
          payload: { orderId: "5082", amount: 145.0, currency: "USD" },
        }),
      });
      const data = await res.json();
      if (data.success) {
        await handleUpdateAgentStatus(
          agentId,
          "waiting_approval",
          "Awaiting operator sign-off in The Boss Desk",
          "Action held at HITL gate!"
        );
        showNotification(`Action queued at The Boss Desk for @${agentId}.`);
        setIsApprovalsOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Resolve HITL Approval
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
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Approval action ${action}ed.`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-cyan-600 text-slate-950 font-mono font-bold px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 border border-cyan-400 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <HQHeader
        currentRoom={currentRoom}
        onRoomSelect={setCurrentRoom}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        totalAgents={campusStats.total}
        onOpenBrainVault={() => setIsBrainVaultOpen(true)}
      />

      {/* Main Command Surface */}
      <div className="flex-1 p-3 md:p-5 flex flex-col xl:flex-row gap-4 max-w-[1720px] w-full mx-auto">
        {/* Left/Center Viewport */}
        <div className="flex-1 flex flex-col space-y-3">
          <CampusViewport
            viewMode={viewMode}
            currentRoom={currentRoom}
            agents={agents}
            selectedAgentId={selectedAgent?.id || null}
            onSelectAgent={(agent) => {
              if (agent) {
                setSelectedAgent(agent);
              }
            }}
            onRoomChange={setCurrentRoom}
          />
        </div>

        {/* Right Command Sidebar */}
        <HQSidebar
          stats={campusStats}
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={(agent) => setSelectedAgent(agent)}
          onRouteAgent={handleRouteAgent}
          onOpenApprovals={() => setIsApprovalsOpen(true)}
        />
      </div>

      {/* Modals */}
      {isApprovalsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl relative">
            <button
              onClick={() => setIsApprovalsOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-bold z-10"
            >
              ✕
            </button>
            <HITLQueueModal
              approvals={approvals}
              onResolve={handleResolveApproval}
              isLoading={false}
            />
          </div>
        </div>
      )}

      <BrainVaultModal
        isOpen={isBrainVaultOpen}
        onClose={() => setIsBrainVaultOpen(false)}
      />

      {isDetailModalOpen && selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdateStatus={handleUpdateAgentStatus}
          onTriggerHITL={handleTriggerHITLAction}
        />
      )}
    </div>
  );
}
