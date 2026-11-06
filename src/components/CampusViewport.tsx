"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { AgentProfile, RoomLocation } from "@/types";
import {
  renderIsometricCampus,
  getAgentAtIsometricCoords,
  getRoomAtIsometricCoords,
  CAMPUS_WIDTH,
  CAMPUS_HEIGHT,
  RippleEffect,
} from "@/lib/isometric-campus-renderer";
import { ThreeCampus } from "@/components/ThreeCampus";
import { RotateCcw, Compass } from "lucide-react";

interface CampusViewportProps {
  viewMode: "2d" | "3d";
  currentRoom: RoomLocation;
  agents: AgentProfile[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentProfile | null) => void;
  onRoomChange: (room: RoomLocation) => void;
  onMoveAgentDirectly?: (agentId: string, x: number, y: number) => void;
}

export const CampusViewport: React.FC<CampusViewportProps> = ({
  viewMode,
  currentRoom,
  agents,
  selectedAgentId,
  onSelectAgent,
  onRoomChange,
  onMoveAgentDirectly,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetCamRef = useRef<{ panX: number; panY: number; zoom: number }>({
    panX: 0,
    panY: 0,
    zoom: 1,
  });

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tickRef = useRef<number>(0);
  const ripplesRef = useRef<RippleEffect[]>([]);

  // Local animated agent positions for 60fps interpolation
  const localAgentsRef = useRef<AgentProfile[]>([]);

  useEffect(() => {
    // Keep local agents in sync with incoming server state while preserving active walking
    localAgentsRef.current = agents.map((agent) => {
      const existing = localAgentsRef.current.find((a) => a.id === agent.id);
      if (existing && existing.targetCoordinates) {
        return {
          ...agent,
          currentCoordinates: { ...existing.currentCoordinates },
          targetCoordinates: { ...existing.targetCoordinates },
        };
      }
      return { ...agent };
    });
  }, [agents]);

  // Update room focus with smooth interpolation target
  useEffect(() => {
    switch (currentRoom) {
      case "focus_work":
        targetCamRef.current = { panX: 130, panY: 100, zoom: 1.35 };
        break;
      case "server_bay":
        targetCamRef.current = { panX: -110, panY: 120, zoom: 1.35 };
        break;
      case "pantry":
      case "all_hands":
        targetCamRef.current = { panX: 250, panY: -40, zoom: 1.35 };
        break;
      case "gym":
        targetCamRef.current = { panX: 170, panY: -150, zoom: 1.35 };
        break;
      case "brain":
        targetCamRef.current = { panX: 0, panY: -20, zoom: 1.4 };
        break;
      case "overview":
      default:
        targetCamRef.current = { panX: 0, panY: 0, zoom: 1.0 };
        break;
    }
  }, [currentRoom]);

  // 2D Canvas Render Loop with Camera Lerp and Agent Interpolation
  useEffect(() => {
    if (viewMode !== "2d") return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      tickRef.current += 1;

      // Smooth camera lerp towards target if not dragging
      if (!isDraggingRef.current) {
        setPan((prev) => {
          const dx = targetCamRef.current.panX - prev.x;
          const dy = targetCamRef.current.panY - prev.y;
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            return { x: prev.x + dx * 0.1, y: prev.y + dy * 0.1 };
          }
          return prev;
        });

        setZoom((prev) => {
          const dz = targetCamRef.current.zoom - prev;
          if (Math.abs(dz) > 0.005) {
            return prev + dz * 0.1;
          }
          return prev;
        });
      }

      // 60 FPS agent walking interpolation
      for (const a of localAgentsRef.current) {
        if (a.targetCoordinates) {
          const dx = a.targetCoordinates.x - a.currentCoordinates.x;
          const dy = a.targetCoordinates.y - a.currentCoordinates.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 2.5) {
            a.currentCoordinates.x = a.targetCoordinates.x;
            a.currentCoordinates.y = a.targetCoordinates.y;
            delete a.targetCoordinates;
          } else {
            a.currentCoordinates.x += (dx / dist) * Math.min(dist, 3.5);
            a.currentCoordinates.y += (dy / dist) * Math.min(dist, 3.5);
          }
        }
      }

      // Update click ripples
      ripplesRef.current = ripplesRef.current
        .map((r) => ({
          ...r,
          radius: r.radius + (r.maxRadius - r.radius) * 0.12 + 0.5,
          opacity: r.opacity - 0.03,
        }))
        .filter((r) => r.opacity > 0.05);

      renderIsometricCampus(
        ctx,
        localAgentsRef.current,
        selectedAgentId,
        hoveredAgentId,
        tickRef.current,
        zoom,
        pan,
        ripplesRef.current
      );

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewMode, selectedAgentId, hoveredAgentId, zoom, pan]);

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
      const newPan = {
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      };
      setPan(newPan);
      targetCamRef.current.panX = newPan.x;
      targetCamRef.current.panY = newPan.y;
      return;
    }

    const { x, y } = getTransformedCoordinates(e);
    const agent = getAgentAtIsometricCoords(x, y, localAgentsRef.current);
    setHoveredAgentId(agent ? agent.id : null);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getTransformedCoordinates(e);

    // Add visual click ripple
    ripplesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: 28,
      opacity: 0.9,
    });

    const agent = getAgentAtIsometricCoords(x, y, localAgentsRef.current);
    if (agent) {
      onSelectAgent(agent);
      return;
    }

    // Check if clicked an empty floor space in a room
    const clickedRoom = getRoomAtIsometricCoords(x, y);
    if (clickedRoom) {
      onRoomChange(clickedRoom.type);
    }

    // If an agent is selected and user clicks holding shift or empty spot
    if (e.shiftKey && selectedAgentId && onMoveAgentDirectly) {
      onMoveAgentDirectly(selectedAgentId, x, y);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const newZoom = Math.min(Math.max(zoom - e.deltaY * 0.001, 0.75), 2.2);
    setZoom(newZoom);
    targetCamRef.current.zoom = newZoom;
  };

  const resetCamera = () => {
    targetCamRef.current = { panX: 0, panY: 0, zoom: 1.0 };
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
            style={{
              imageRendering: "pixelated",
              cursor: hoveredAgentId ? "pointer" : isDraggingRef.current ? "grabbing" : "grab",
            }}
          />
        </div>
      )}

      {/* Floating Viewport Status Bar (Matches Screenshot with Compass 'N') */}
      <div className="w-full bg-[#050b14]/95 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center space-x-3">
          {/* Compass 'N' Indicator matching screenshot */}
          <div
            onClick={resetCamera}
            title="Isometric Compass (North)"
            className="w-6 h-6 rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-[10px] shadow cursor-pointer hover:border-cyan-300 transition-all"
          >
            N
          </div>

          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            VIEWPORT ({viewMode.toUpperCase()} ISO):{" "}
            <span className="text-slate-200">{currentRoom.toUpperCase().replace("_", " ")}</span>
          </span>

          <button
            onClick={resetCamera}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:text-white hover:border-slate-500 transition-all text-[10px]"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" /> Reset Camera
          </button>
        </div>

        <div className="text-slate-400 text-[10px] tracking-wide flex items-center gap-2">
          <span>Click Agent to Inspect & Route</span>
          <span>•</span>
          <span>Drag to Pan</span>
          <span>•</span>
          <span>Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
};
