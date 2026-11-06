"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { AgentProfile, RoomLocation } from "@/types";
import {
  renderIsometricCampus,
  getAgentAtIsometricCoords,
  CAMPUS_WIDTH,
  CAMPUS_HEIGHT,
} from "@/lib/isometric-campus-renderer";
import { ThreeCampus } from "@/components/ThreeCampus";
import { RotateCcw } from "lucide-react";

interface CampusViewportProps {
  viewMode: "2d" | "3d";
  currentRoom: RoomLocation;
  agents: AgentProfile[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentProfile | null) => void;
  onRoomChange: (room: RoomLocation) => void;
}

export const CampusViewport: React.FC<CampusViewportProps> = ({
  viewMode,
  currentRoom,
  agents,
  selectedAgentId,
  onSelectAgent,
  onRoomChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tickRef = useRef<number>(0);

  // Update room focus
  useEffect(() => {
    switch (currentRoom) {
      case "focus_work":
        setPan({ x: 120, y: 100 });
        setZoom(1.3);
        break;
      case "server_bay":
        setPan({ x: -120, y: 120 });
        setZoom(1.3);
        break;
      case "pantry":
      case "all_hands":
        setPan({ x: 250, y: -40 });
        setZoom(1.35);
        break;
      case "gym":
        setPan({ x: 180, y: -150 });
        setZoom(1.35);
        break;
      case "brain":
        setPan({ x: 0, y: -20 });
        setZoom(1.4);
        break;
      case "overview":
      default:
        setPan({ x: 0, y: 0 });
        setZoom(1.0);
        break;
    }
  }, [currentRoom]);

  // 2D Canvas Render Loop
  useEffect(() => {
    if (viewMode !== "2d") return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      tickRef.current += 1;
      renderIsometricCampus(
        ctx,
        agents,
        selectedAgentId,
        hoveredAgentId,
        tickRef.current,
        zoom,
        pan
      );
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewMode, agents, selectedAgentId, hoveredAgentId, zoom, pan]);

  // Handle High-DPI scaling
  useEffect(() => {
    if (viewMode !== "2d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CAMPUS_WIDTH * dpr;
    canvas.height = CAMPUS_HEIGHT * dpr;
    canvas.style.width = `${CAMPUS_WIDTH}px`;
    canvas.style.height = `${CAMPUS_HEIGHT}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [viewMode]);

  // Mouse coordinate transformation
  const getTransformedCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = CAMPUS_WIDTH / rect.width;
      const scaleY = CAMPUS_HEIGHT / rect.height;

      const rawX = (e.clientX - rect.left) * scaleX;
      const rawY = (e.clientY - rect.top) * scaleY;

      // Inverse of camera transform
      const originX = CAMPUS_WIDTH / 2;
      const originY = CAMPUS_HEIGHT / 2;

      const worldX = (rawX - originX - pan.x) / zoom + originX;
      const worldY = (rawY - originY - pan.y) / zoom + originY;

      return { x: worldX, y: worldY };
    },
    [zoom, pan]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
      return;
    }

    const { x, y } = getTransformedCoordinates(e);
    const agent = getAgentAtIsometricCoords(x, y, agents);
    setHoveredAgentId(agent ? agent.id : null);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getTransformedCoordinates(e);
    const agent = getAgentAtIsometricCoords(x, y, agents);
    onSelectAgent(agent);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const newZoom = Math.min(Math.max(zoom - e.deltaY * 0.001, 0.7), 2.2);
    setZoom(newZoom);
  };

  const resetCamera = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
    onRoomChange("overview");
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
    >
      {viewMode === "3d" ? (
        <ThreeCampus
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={onSelectAgent}
        />
      ) : (
        <div className="w-full flex items-center justify-center overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className="w-full h-auto max-w-full"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}

      {/* Floating Viewport Status Bar (Matches Screenshot) */}
      <div className="w-full bg-slate-950/95 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400 font-bold uppercase">
            VIEWPORT ({viewMode.toUpperCase()} ISO): {currentRoom.toUpperCase().replace("_", " ")}
          </span>
          <button
            onClick={resetCamera}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:text-white transition-all text-[10px]"
          >
            <RotateCcw className="w-3 h-3" /> Reset Camera
          </button>
        </div>

        <div className="text-slate-500 text-[10px]">
          Click Agent to Inspect & Route • Drag to Pan • Scroll to Zoom
        </div>
      </div>
    </div>
  );
};

