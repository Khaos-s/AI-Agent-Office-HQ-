"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentProfile, RoomLocation } from "@/types";
import {
  renderIsometricCampus,
  getAgentAtIsometricCoords,
  getRoomAtIsometricCoords,
  CAMPUS_WIDTH,
  CAMPUS_HEIGHT,
  RippleEffect,
} from "@/lib/isometric-campus-renderer";
import { RotateCcw } from "lucide-react";

interface CampusViewportProps {
  currentRoom: RoomLocation;
  agents: AgentProfile[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentProfile | null) => void;
  onRoomChange: (room: RoomLocation) => void;
  onMoveAgentDirectly?: (agentId: string, x: number, y: number) => void;
}

export const CampusViewport: React.FC<CampusViewportProps> = ({
  currentRoom,
  agents,
  selectedAgentId,
  onSelectAgent,
  onRoomChange,
  onMoveAgentDirectly,
}) => {
  const canvasRef      = useRef<HTMLCanvasElement | null>(null);
  const containerRef   = useRef<HTMLDivElement | null>(null);
  const zoomRef        = useRef(1);
  const panRef         = useRef({ x: 0, y: 0 });
  const targetCamRef   = useRef({ panX: 0, panY: 0, zoom: 1 });
  const isDraggingRef  = useRef(false);
  const dragStartRef   = useRef({ x: 0, y: 0 });
  const tickRef        = useRef(0);
  const ripplesRef     = useRef<RippleEffect[]>([]);
  const hoveredIdRef   = useRef<string | null>(null);
  const rafRef         = useRef<number>(0);
  const localAgentsRef = useRef<AgentProfile[]>([]);
  const dprRef         = useRef(1);
  // Track canvas logical size for coordinate math
  const canvasSizeRef  = useRef({ w: CAMPUS_WIDTH, h: CAMPUS_HEIGHT });

  // Sync agents without losing walking progress
  useEffect(() => {
    localAgentsRef.current = agents.map((a) => {
      const ex = localAgentsRef.current.find((e) => e.id === a.id);
      if (ex?.targetCoordinates) {
        return { ...a, currentCoordinates: { ...ex.currentCoordinates }, targetCoordinates: { ...ex.targetCoordinates } };
      }
      return { ...a };
    });
  }, [agents]);

  // Camera presets by room
  useEffect(() => {
    const presets: Record<string, { panX: number; panY: number; zoom: number }> = {
      overview:    { panX: 0,    panY: 0,    zoom: 1.0  },
      focus_work:  { panX: 130,  panY: 100,  zoom: 1.4  },
      server_bay:  { panX: -110, panY: 100,  zoom: 1.4  },
      pantry:      { panX: 240,  panY: -30,  zoom: 1.4  },
      all_hands:   { panX: 240,  panY: -30,  zoom: 1.4  },
      gym:         { panX: 170,  panY: -150, zoom: 1.4  },
      brain:       { panX: 0,    panY: -20,  zoom: 1.5  },
    };
    const p = presets[currentRoom] ?? presets.overview;
    targetCamRef.current = p;
  }, [currentRoom]);

  // Resize canvas to fill its container at device pixel ratio
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      canvasSizeRef.current = { w, h };
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loop = () => {
      tickRef.current++;

      // Smooth camera lerp
      const cam = targetCamRef.current;
      if (!isDraggingRef.current) {
        panRef.current.x += (cam.panX - panRef.current.x) * 0.1;
        panRef.current.y += (cam.panY - panRef.current.y) * 0.1;
        zoomRef.current  += (cam.zoom - zoomRef.current)  * 0.1;
      }

      // Agent position interpolation (60fps smooth walk)
      for (const a of localAgentsRef.current) {
        if (a.targetCoordinates) {
          const dx   = a.targetCoordinates.x - a.currentCoordinates.x;
          const dy   = a.targetCoordinates.y - a.currentCoordinates.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 2.5) {
            a.currentCoordinates = { ...a.targetCoordinates };
            delete a.targetCoordinates;
          } else {
            const spd = Math.min(dist, 3.5);
            a.currentCoordinates.x += (dx / dist) * spd;
            a.currentCoordinates.y += (dy / dist) * spd;
          }
        }
      }

      // Ripple decay
      ripplesRef.current = ripplesRef.current
        .map((r) => ({ ...r, radius: r.radius + 1.2, opacity: r.opacity - 0.025 }))
        .filter((r) => r.opacity > 0.02);

      // Render at logical canvas size (resize observer keeps canvas.width/height in sync)
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear at physical pixels then re-scale
        const dpr = dprRef.current;
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderIsometricCampus(
          ctx,
          localAgentsRef.current,
          selectedAgentId,
          hoveredIdRef.current,
          tickRef.current,
          zoomRef.current,
          panRef.current,
          ripplesRef.current,
          canvasSizeRef.current.w,
          canvasSizeRef.current.h,
        );
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgentId]);

  // --- Coordinate helpers ---
  const toWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect  = canvas.getBoundingClientRect();
    const lw    = canvasSizeRef.current.w;
    const lh    = canvasSizeRef.current.h;
    const rawX  = ((clientX - rect.left) / rect.width)  * lw;
    const rawY  = ((clientY - rect.top)  / rect.height) * lh;
    const ox    = lw / 2;
    const oy    = lh / 2;
    const zoom  = zoomRef.current;
    const pan   = panRef.current;
    return { x: (rawX - ox - pan.x) / zoom + ox, y: (rawY - oy - pan.y) / zoom + oy };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartRef.current  = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const nx = e.clientX - dragStartRef.current.x;
      const ny = e.clientY - dragStartRef.current.y;
      panRef.current = { x: nx, y: ny };
      targetCamRef.current.panX = nx;
      targetCamRef.current.panY = ny;
      return;
    }
    const { x, y } = toWorld(e.clientX, e.clientY);
    const hit = getAgentAtIsometricCoords(x, y, localAgentsRef.current);
    hoveredIdRef.current = hit?.id ?? null;
  };

  const onMouseUp = () => { isDraggingRef.current = false; };

  const onClick = (e: React.MouseEvent) => {
    const { x, y } = toWorld(e.clientX, e.clientY);

    ripplesRef.current.push({ x, y, radius: 4, maxRadius: 32, opacity: 0.85 });

    const agent = getAgentAtIsometricCoords(x, y, localAgentsRef.current);
    if (agent) { onSelectAgent(agent); return; }

    // Shift+click to send selected agent to clicked tile
    if (e.shiftKey && selectedAgentId && onMoveAgentDirectly) {
      onMoveAgentDirectly(selectedAgentId, x, y);
      return;
    }

    const room = getRoomAtIsometricCoords(x, y);
    if (room) onRoomChange(room.type);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const nz = Math.min(Math.max(zoomRef.current - e.deltaY * 0.001, 0.75), 2.5);
    zoomRef.current = nz;
    targetCamRef.current.zoom = nz;
  };

  const resetCamera = () => {
    targetCamRef.current = { panX: 0, panY: 0, zoom: 1 };
    onRoomChange("overview");
  };

  return (
    <div ref={containerRef} className="scanlines relative flex-1 overflow-hidden bg-[#07090f]">
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClick}
        onWheel={onWheel}
        className="absolute inset-0 h-full w-full canvas-drag"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Bottom-left HUD bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="pointer-events-auto absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/60 px-3 py-1.5 text-[10px] font-mono text-slate-400 backdrop-blur-md"
      >
        {/* Compass N */}
        <div
          onClick={resetCamera}
          title="Reset camera"
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/10 text-[9px] font-black text-sky-300 transition hover:bg-sky-500/20"
        >
          N
        </div>
        <span className="text-sky-400 uppercase tracking-wider">2D ISO</span>
        <span className="text-slate-600">·</span>
        <span className="capitalize">{currentRoom.replace(/_/g, " ")}</span>
        <button
          onClick={resetCamera}
          className="ml-1 flex items-center gap-1 text-slate-500 transition hover:text-slate-200"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </motion.div>

      {/* Bottom-right hint */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 select-none text-[9px] font-mono text-slate-600">
        Click agent · Drag pan · Scroll zoom · Shift+click to move
      </div>
    </div>
  );
};
