"use client";

import React, { useState } from "react";
import { MemoryEntry } from "@/types";
import { Brain, Plus, Search, Tag, Calendar, UserCheck } from "lucide-react";

interface MemoryExplorerProps {
  memories: MemoryEntry[];
  onAddMemory: (entry: { agentId: string; title: string; content: string; tags: string[] }) => Promise<void>;
  isLoading: boolean;
}

export const MemoryExplorer: React.FC<MemoryExplorerProps> = ({
  memories,
  onAddMemory,
  isLoading,
}) => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAgent, setNewAgent] = useState("lead");
  const [newTags, setNewTags] = useState("");

  // Extract unique tags
  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags)));

  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? m.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    await onAddMemory({
      agentId: newAgent,
      title: newTitle,
      content: newContent,
      tags: tagsArray.length > 0 ? tagsArray : ["general"],
    });

    setNewTitle("");
    setNewContent("");
    setNewTags("");
    setIsAdding(false);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-sky-400" />
            The Shared Brain (Central Memory)
          </h2>
          <p className="text-xs text-slate-400">
            Unified knowledge layer: all department agents read from and write to this collective memory.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? "Close Form" : "Add Memory Entry"}</span>
        </button>
      </div>

      {/* Add Memory Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 my-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
            Create Shared Knowledge Record
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Author Agent</label>
              <select
                value={newAgent}
                onChange={(e) => setNewAgent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="lead">Lead (@lead)</option>
                <option value="research">Research (@research)</option>
                <option value="scripts">Scripts (@scripts)</option>
                <option value="social">Social (@social)</option>
                <option value="analytics">Analytics (@analytics)</option>
                <option value="tbx-shop">TBX Shop (@tbx-shop)</option>
                <option value="dev">Dev (@dev)</option>
                <option value="inbox">Inbox (@inbox)</option>
                <option value="creative">Creative (@creative)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="architecture, policy, radar"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Brand Tone Guidelines for Video Production"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Content / Knowledge Spec</label>
            <textarea
              rows={3}
              placeholder="Record learnings, facts, rules, or system constraints..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded transition-all"
            >
              Commit to Shared Brain
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search collective memory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-500/50"
          />
        </div>

        {/* Tag pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs font-mono">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded transition-all ${
              selectedTag === null
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                selectedTag === tag
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tag className="w-2.5 h-2.5" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {filteredMemories.map((entry) => (
          <div
            key={entry.id}
            className="bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                <span className="flex items-center gap-1 text-indigo-400">
                  <UserCheck className="w-3 h-3" /> @{entry.agentId}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-100">{entry.title}</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>
            </div>

            <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-slate-800/60">
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

