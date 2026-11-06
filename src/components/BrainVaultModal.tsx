"use client";

import React, { useState, useEffect } from "react";
import { X, Brain, FileText, CheckCircle, Shield } from "lucide-react";

interface BrainVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BrainSection {
  category: string;
  files: string[];
}

export const BrainVaultModal: React.FC<BrainVaultModalProps> = ({ isOpen, onClose }) => {
  const [sections, setSections] = useState<BrainSection[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("brain/01-identity/OPERATING-PRINCIPLES.md");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/brain")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.sections) {
          setSections(data.sections);
        }
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedFile) return;

    setLoading(true);
    fetch(`/api/brain?file=${encodeURIComponent(selectedFile)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setContent(data.content);
        }
      })
      .finally(() => setLoading(false));
  }, [isOpen, selectedFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#050b14] border border-cyan-500/40 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-950 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Brain className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>PROCEDURAL BRAIN VAULT</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  BN-00 Invariant Active
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">
                7-Agent Core Suite &amp; Procedural Judgment Layer (Tacit Knowledge, Boundary Conditions, Domain Rules)
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

        {/* Body Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar file tree */}
          <div className="w-72 border-r border-slate-800/80 bg-slate-950/60 p-4 overflow-y-auto space-y-4">
            {sections.map((sec) => (
              <div key={sec.category} className="space-y-1">
                <h4 className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  {sec.category}
                </h4>
                <div className="space-y-0.5">
                  {sec.files.map((f) => {
                    const fileName = f.split("/").pop();
                    const isSelected = selectedFile === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setSelectedFile(f)}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-1.5 transition-all text-[11px] truncate ${
                          isSelected
                            ? "bg-cyan-600 text-white font-bold"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                        }`}
                      >
                        <FileText className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{fileName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Markdown Content Viewer */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/30">
            {loading ? (
              <div className="py-20 text-center text-slate-500">
                Loading knowledge specifications...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold">{selectedFile}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Synced with Agent Roster
                  </span>
                </div>

                <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {content || "Select a specification file from the vault to inspect."}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

