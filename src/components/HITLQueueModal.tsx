"use client";

import React, { useState } from "react";
import { HITLApproval } from "@/types";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, History, ArrowRight } from "lucide-react";

interface HITLQueueModalProps {
  approvals: HITLApproval[];
  onResolve: (id: string, action: "approve" | "reject", comment?: string) => Promise<void>;
  isLoading: boolean;
}

export const HITLQueueModal: React.FC<HITLQueueModalProps> = ({
  approvals,
  onResolve,
  isLoading,
}) => {
  const [filter, setFilter] = useState<"pending" | "resolved">("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const pendingItems = approvals.filter((a) => a.status === "pending");
  const resolvedItems = approvals.filter((a) => a.status !== "pending");
  const displayedItems = filter === "pending" ? pendingItems : resolvedItems;

  const selectedItem = approvals.find((a) => a.id === selectedId) || displayedItems[0];

  const handleApprove = async (id: string) => {
    await onResolve(id, "approve", "Approved by Human Operator");
  };

  const handleReject = async (id: string) => {
    if (!rejectComment) {
      setIsRejecting(true);
      return;
    }
    await onResolve(id, "reject", rejectComment);
    setRejectComment("");
    setIsRejecting(false);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "critical":
      case "high":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-sky-500/20 text-sky-400 border-sky-500/30";
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Human-in-the-Loop (HITL) Queue
          </h2>
          <p className="text-xs text-slate-400">
            Mandatory human verification gate for sensitive, public, or financial operations.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded transition-all ${
              filter === "pending"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pending ({pendingItems.length})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1 ${
              filter === "resolved"
                ? "bg-slate-800 text-slate-200 font-bold border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <History className="w-3 h-3" /> Audit Log ({resolvedItems.length})
          </button>
        </div>
      </div>

      {displayedItems.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mb-2" />
          <h3 className="text-sm font-medium text-slate-300">
            {filter === "pending" ? "All Clear! No Pending Actions" : "No Resolved Actions Found"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {filter === "pending"
              ? "All department agents are running within normal non-sensitive parameters. Actions requiring financial or public sign-off will appear here."
              : "Completed and rejected actions are archived here with immutable audit receipts."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          {/* List column */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? "bg-slate-900/90 border-amber-500/60 shadow-lg"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold ${getRiskBadge(
                      item.riskLevel
                    )}`}
                  >
                    {item.riskLevel} risk
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-200 mt-2 truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                  <span className="text-indigo-400">Agent: @{item.agentId}</span>
                  <span className="capitalize text-slate-300">{item.actionType.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Details / Inspector column */}
          {selectedItem && (
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold ${getRiskBadge(
                        selectedItem.riskLevel
                      )}`}
                    >
                      {selectedItem.riskLevel} Risk Action
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-2">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedItem.description}
                    </p>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-500">
                    <div>Status: <span className="uppercase font-bold text-amber-400">{selectedItem.status}</span></div>
                    <div>Agent: @{selectedItem.agentId}</div>
                  </div>
                </div>

                {/* Payload JSON Inspector */}
                <div>
                  <h4 className="text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1">
                    <span>Target Payload (Immutable Snapshot)</span>
                  </h4>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto max-h-44">
                    {JSON.stringify(selectedItem.payload, null, 2)}
                  </pre>
                </div>

                {/* Execution Receipt if resolved */}
                {selectedItem.executionReceipt && (
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Execution Receipt
                    </h4>
                    <pre className="p-3 bg-slate-950/80 border border-emerald-500/30 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-36">
                      {JSON.stringify(selectedItem.executionReceipt, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedItem.resolutionComment && (
                  <div className="text-xs font-mono p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-slate-500">Reviewer Note ({selectedItem.resolvedBy}):</span>{" "}
                    {selectedItem.resolutionComment}
                  </div>
                )}
              </div>

              {/* Action Buttons for Pending item */}
              {selectedItem.status === "pending" && (
                <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                  {isRejecting ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="State reason for rejection..."
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-rose-500/40 rounded px-3 py-2 text-slate-200 outline-none focus:border-rose-500"
                      />
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setIsRejecting(false)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(selectedItem.id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded transition-all"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setIsRejecting(true)}
                        disabled={isLoading}
                        className="px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 border border-rose-500/30 rounded-lg transition-all"
                      >
                        Reject Action
                      </button>
                      <button
                        onClick={() => handleApprove(selectedItem.id)}
                        disabled={isLoading}
                        className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Execute</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

