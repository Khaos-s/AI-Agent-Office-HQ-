"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AgentProfile, HITLApproval, MemoryEntry, RadarItem, AgentStatus } from "@/types";
import { Navbar } from "@/components/Navbar";
import { OfficeCanvas } from "@/components/OfficeCanvas";
import { AgentDetailModal } from "@/components/AgentDetailModal";
import { HITLQueueModal } from "@/components/HITLQueueModal";
import { MemoryExplorer } from "@/components/MemoryExplorer";
import { RadarDashboard } from "@/components/RadarDashboard";
import { PlayCircle, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"office" | "hitl" | "memory" | "radar">("office");
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [approvals, setApprovals] = useState<HITLApproval[]>([]);
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [radarItems, setRadarItems] = useState<RadarItem[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastScannedAt, setLastScannedAt] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all state
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [officeRes, approvalsRes, memoryRes, radarRes] = await Promise.all([
        fetch("/api/office/state").then((r) => r.json()),
        fetch("/api/approvals").then((r) => r.json()),
        fetch("/api/memory").then((r) => r.json()),
        fetch("/api/radar/scan").then((r) => r.json()),
      ]);

      if (officeRes.success) setAgents(officeRes.agents);
      if (approvalsRes.success) setApprovals(approvalsRes.approvals);
      if (memoryRes.success) setMemories(memoryRes.memories);
      if (radarRes.success) {
        setRadarItems(radarRes.items);
        setLastScannedAt(radarRes.scannedAt);
      }
    } catch (err) {
      console.error("Failed to sync office state", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Live polling every 3,000ms
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Keep selectedAgent updated if agents change
  useEffect(() => {
    if (selectedAgent) {
      const updated = agents.find((a) => a.id === selectedAgent.id);
      if (updated) setSelectedAgent(updated);
    }
  }, [agents, selectedAgent]);

  // Update Agent Status
  const handleUpdateAgentStatus = async (
    id: string,
    status: AgentStatus,
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
        showNotification(`Updated @${id} status to ${status}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger HITL sensitive action from agent
  const handleTriggerHITLAction = async (agentId: string) => {
    let actionType = "shopify_refund";
    let title = "Customer Refund Request";
    let desc = "Agent staged refund for defective item";
    let payload: Record<string, any> = { orderId: "8912", amount: 65.0, currency: "USD" };

    if (agentId === "social") {
      actionType = "social_publish";
      title = "Publish Product Teaser Video";
      desc = "Public post queued for Twitter feed";
      payload = { platform: "twitter", content: "Excited to share our newest demo! 🚀" };
    } else if (agentId === "inbox") {
      actionType = "email_send";
      title = "Outbound Enterprise Sponsorship Reply";
      desc = "Sending agreement terms to external partner";
      payload = { recipient: "brand@sponsor.co", subject: "Sponsorship Terms Q4" };
    }

    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          actionType,
          title,
          description: desc,
          riskLevel: "high",
          payload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Update agent status to awaiting_approval
        await handleUpdateAgentStatus(
          agentId,
          "awaiting_approval",
          `Awaiting operator sign-off: ${title}`,
          "Action queued for human approval!"
        );
        fetchData();
        showNotification(`Triggered HITL gate for @${agentId}. Review required.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Resolve HITL action (approve or reject)
  const handleResolveApproval = async (
    id: string,
    action: "approve" | "reject",
    comment?: string
  ) => {
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewer: "Chief Operator", comment }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Action ${action === "approve" ? "approved & executed" : "rejected"}.`);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Shared Memory
  const handleAddMemory = async (entry: {
    agentId: string;
    title: string;
    content: string;
    tags: string[];
  }) => {
    try {
      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Knowledge added to Shared Brain.`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Radar Scan
  const handleTriggerRadarScan = async () => {
    try {
      const res = await fetch("/api/radar/scan", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setRadarItems(data.items);
        showNotification(`GitHub Radar scan complete! Found ${data.count} trending repos.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick Action: Simulate Full Office Sprint
  const handleSimulateSprint = async () => {
    const tasks: Record<string, { status: AgentStatus; task: string; speech: string }> = {
      lead: { status: "working", task: "Delegating daily departmental sprint goals", speech: "Sprint initiated." },
      research: { status: "working", task: "Scoring trending open-source agent repos", speech: "Radar scan live." },
      scripts: { status: "working", task: "Drafting release notes and video script", speech: "Drafting script." },
      social: { status: "thinking", task: "Analyzing hashtag engagement metrics", speech: "Analyzing reach." },
      analytics: { status: "working", task: "Aggregating telemetry from sub-agent runs", speech: "Metrics updating." },
      "tbx-shop": { status: "working", task: "Auditing order fulfillment and inventory", speech: "Orders verified." },
      dev: { status: "working", task: "Running test suites in worktree branch", speech: "Compiling tests." },
      inbox: { status: "thinking", task: "Classifying incoming partnership proposals", speech: "Sorting inbox." },
      creative: { status: "working", task: "Rendering pixel office composition video", speech: "Rendering assets." },
    };

    for (const [id, t] of Object.entries(tasks)) {
      await handleUpdateAgentStatus(id, t.status, t.task, t.speech);
    }
    showNotification("Full Office Sprint dispatched across all 9 departments!");
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === "pending").length;
  const activeAgentsCount = agents.filter((a) => a.status === "working" || a.status === "thinking").length;

  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono flex items-center gap-2 border border-indigo-400/40 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        activeAgentsCount={activeAgentsCount}
        onRefresh={fetchData}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Body */}
      <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 mt-6 space-y-6">
        {/* Banner Alert if pending approvals */}
        {pendingApprovalsCount > 0 && activeTab !== "hitl" && (
          <div
            onClick={() => setActiveTab("hitl")}
            className="p-3 bg-amber-950/40 border border-amber-500/40 hover:border-amber-500 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-lg shadow-amber-950/30"
          >
            <div className="flex items-center gap-2.5 text-xs text-amber-300 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>
                <strong>{pendingApprovalsCount} Action{pendingApprovalsCount > 1 ? "s" : ""} Awaiting Sign-off</strong> in the Human-in-the-Loop queue.
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              Open Queue &rarr;
            </span>
          </div>
        )}

        {/* Tab 1: Virtual Office Floor */}
        {activeTab === "office" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 border border-slate-800 rounded-xl">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  HQ Simulation Command Center
                </h2>
                <p className="text-xs text-slate-400">
                  9 specialized department desks, real-time speech bubbles, and automatic HITL pause states.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateSprint}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Dispatch All-Hands Sprint</span>
                </button>
              </div>
            </div>

            <OfficeCanvas
              agents={agents}
              selectedAgentId={selectedAgent?.id || null}
              onSelectAgent={(agent) => setSelectedAgent(agent)}
            />
          </div>
        )}

        {/* Tab 2: HITL Queue */}
        {activeTab === "hitl" && (
          <HITLQueueModal
            approvals={approvals}
            onResolve={handleResolveApproval}
            isLoading={isRefreshing}
          />
        )}

        {/* Tab 3: Shared Brain */}
        {activeTab === "memory" && (
          <MemoryExplorer
            memories={memories}
            onAddMemory={handleAddMemory}
            isLoading={isRefreshing}
          />
        )}

        {/* Tab 4: GitHub Radar */}
        {activeTab === "radar" && (
          <RadarDashboard
            items={radarItems}
            onTriggerScan={handleTriggerRadarScan}
            isLoading={isRefreshing}
            lastScannedAt={lastScannedAt}
          />
        )}
      </div>

      {/* Selected Agent Inspector Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onUpdateStatus={handleUpdateAgentStatus}
          onTriggerHITL={handleTriggerHITLAction}
        />
      )}
    </main>
  );
}

