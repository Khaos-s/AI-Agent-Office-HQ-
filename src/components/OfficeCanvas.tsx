"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { AgentProfile } from "@/types";
import {
  renderOffice,
  getAgentAtCoordinates,
  OFFICE_WIDTH,
  OFFICE_HEIGHT,
} from "@/lib/canvas-renderer";

interface OfficeCanvasProps {
  agents: AgentProfile[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentProfile | null) => void;
}

export const OfficeCanvas: React.FC<OfficeCanvasProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const tickRef = useRef<number>(0);

  // Animation render loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      tickRef.current += 1;
      renderOffice(ctx, agents, selectedAgentId, hoveredAgentId, tickRef.current);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [agents, selectedAgentId, hoveredAgentId]);

  // Handle High-DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = OFFICE_WIDTH * dpr;
    canvas.height = OFFICE_HEIGHT * dpr;
    canvas.style.width = `${OFFICE_WIDTH}px`;
    canvas.style.height = `${OFFICE_HEIGHT}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  // Mouse coordinate mapping
  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = OFFICE_WIDTH / rect.width;
      const scaleY = OFFICE_HEIGHT / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    const agent = getAgentAtCoordinates(x, y, agents);
    setHoveredAgentId(agent ? agent.id : null);
  };

  const handleMouseLeave = () => {
    setHoveredAgentId(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    const agent = getAgentAtCoordinates(x, y, agents);
    onSelectAgent(agent);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="absolute top-3 left-4 flex items-center space-x-2 z-10">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Virtual HQ Floor (Live)
        </span>
      </div>

      <div className="absolute top-3 right-4 flex items-center space-x-3 text-xs text-slate-400 font-mono z-10">
        <span>Click an agent to inspect</span>
      </div>

      <div className="w-full flex items-center justify-center pt-6 pb-2 overflow-auto">
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="border border-slate-700/60 rounded-lg shadow-inner cursor-pointer max-w-full"
          style={{
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* Legend footer */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-3 text-[11px] font-mono border-t border-slate-800/80 text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span>Lead (Executive)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span>Research (Radar)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Scripts (Docs)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
          <span>Social (Staging)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Analytics (Metrics)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>TBX Shop (Shopify)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Dev (Worktrees)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
          <span>Inbox (Mail)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Creative (Studio)</span>
        </div>
      </div>
    </div>
  );
};
