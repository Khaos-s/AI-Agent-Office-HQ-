"use client";

import React, { useEffect, useRef } from "react";
import { AgentProfile, RoomLocation } from "@/types";
import {
  renderIsometricCampus,
  getAgentAtIsometricCoords,
  getRoomAtIsometricCoords,
  CAMPUS_WIDTH,
  CAMPUS_HEIGHT,
  RippleEffect,
} from "@/lib/isometric-campus-renderer";
import { INITIAL_24_AGENTS } from "@/lib/agent-registry";
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
  const zoomRef        = useRef<number>(1.1);
  const panRef         = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetCamRef   = useRef<{ panX: number; panY: number; zoom: number }>({
    panX: 0,
    panY: 0,
    zoom: 1.1,
  });
  const isDraggingRef  = useRef<boolean>(false);
  const dragStartRef   = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tickRef        = useRef<number>(0);
  const ripplesRef     = useRef<RippleEffect[]>([]);
  const hoveredIdRef   = useRef<string | null>(null);
  const rafRef         = useRef<number>(0);
  const localAgentsRef = useRef<AgentProfile[]>(
    agents && agents.length > 0 ? agents : INITIAL_24_AGENTS
  );
  const dprRef         = useRef<number>(1);
  const canvasSizeRef  = useRef<{ w: number; h: number }>({
    w: CAMPUS_WIDTH,
    h: CAMPUS_HEIGHT,
  });

  // Sync agents without losing walking progress
  useEffect(() => {
    if (agents && agents.length > 0) {
      localAgentsRef.current = agents.map((a) => {
        const ex = localAgentsRef.current.find((e) => e.id === a.id);
        if (ex?.targetCoordinates) {
          return {
            ...a,
            currentCoordinates: { ...ex.currentCoordinates },
            targetCoordinates: { ...ex.targetCoordinates },
          };
        }
        return { ...a };
      });
    }
  }, [agents]);

  // Camera presets by room
  useEffect(() => {
    const presets: Record<string, { panX: number; panY: number; zoom: number }> = {
      overview:    { panX: 0,    panY: 0,    zoom: 1.15 },
      focus_work:  { panX: 130,  panY: 100,  zoom: 1.5  },
      server_bay:  { panX: -110, panY: 100,  zoom: 1.5  },
      pantry:      { panX: 240,  panY: -30,  zoom: 1.5  },
      all_hands:   { panX: 240,  panY: -30,  zoom: 1.5  },
      gym:         { panX: 170,  panY: -150, zoom: 1.5  },
      brain:       { panX: 0,    panY: -20,  zoom: 1.6  },
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
      const w = container.clientWidth || window.innerWidth || CAMPUS_WIDTH;
      const h =
        container.clientHeight ||
        (window.innerHeight > 44 ? window.innerHeight - 44 : CAMPUS_HEIGHT);

      canvas.width  = Math.max(w * dpr, 100);
      canvas.height = Math.max(h * dpr, 100);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      canvasSizeRef.current = { w, h };
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener("resize", resize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
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

      // Render at logical canvas size
      const ctx = canvas.getContext("2d");
      if (ctx && canvasSizeRef.current.w > 0 && canvasSizeRef.current.h > 0) {
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
          canvasSizeRef.current.h
        );
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgentId]);

  // Coordinate transformation: Screen -> World Space
  const toWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect  = canvas.getBoundingClientRect();
    const lw    = canvasSizeRef.current.w;
    const lh    = canvasSizeRef.current.h;
    const rawX  = ((clientX - rect.left) / rect.width)  * lw;
    const rawY  = ((clientY - rect.top)  / rect.height) * lh;
    const zoom  = zoomRef.current;
    const pan   = panRef.current;

    // Inverse of:
    // screenX = lw / 2 + pan.x + (worldX - CAMPUS_WIDTH / 2) * zoom
    // screenY = lh / 2 + pan.y + (worldY - CAMPUS_HEIGHT / 2) * zoom
    const worldX = (rawX - lw / 2 - pan.x) / zoom + CAMPUS_WIDTH / 2;
    const worldY = (rawY - lh / 2 - pan.y) / zoom + CAMPUS_HEIGHT / 2;

    return { x: worldX, y: worldY };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartRef.current  = {
      x: e.clientX - panRef.current.x,
      y: e.clientY - panRef.current.y,
    };
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

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  const onClick = (e: React.MouseEvent) => {
    const { x, y } = toWorld(e.clientX, e.clientY);

    ripplesRef.current.push({ x, y, radius: 4, maxRadius: 32, opacity: 0.85 });

    const agent = getAgentAtIsometricCoords(x, y, localAgentsRef.current);
    if (agent) {
      onSelectAgent(agent);
      return;
    }

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
    const nz = Math.min(Math.max(zoomRef.current - e.deltaY * 0.001, 0.6), 2.5);
    zoomRef.current = nz;
    targetCamRef.current.zoom = nz;
  };

  const resetCamera = () => {
    targetCamRef.current = { panX: 0, panY: 0, zoom: 1.15 };
    onRoomChange("overview");
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#07090f] select-none"
      style={{ minHeight: "100%" }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClick}
        onWheel={onWheel}
        className="absolute inset-0 block h-full w-full canvas-drag"
        style={{
          imageRendering: "pixelated",
          cursor: hoveredIdRef.current ? "pointer" : isDraggingRef.current ? "grabbing" : "grab",
        }}
      />

      {/* Bottom-left HUD bar matching command spec */}
      <div className="pointer-events-auto absolute bottom-4 left-4 z-20 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-slate-950/85 px-3.5 py-2 text-[11px] font-mono text-slate-300 backdrop-blur-md shadow-2xl">
        {/* Compass N */}
        <button
          onClick={resetCamera}
          title="Reset camera (North)"
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/20 text-[10px] font-black text-sky-300 transition hover:bg-sky-500/30"
        >
          N
        </button>

        <span className="text-sky-400 font-bold uppercase tracking-wider text-[11px]">
          VIEWPORT (2D ISO):{" "}
          <span className="text-slate-100">{currentRoom.toUpperCase().replace(/_/g, " ")}</span>
        </span>

        <button
          onClick={resetCamera}
          className="ml-2 flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-[10px]"
        >
          <RotateCcw className="h-3 w-3 text-sky-400" /> Reset Camera
        </button>
      </div>

      {/* Bottom-right hint */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-20 select-none text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/[0.07] backdrop-blur-md">
        Click Agent to Inspect & Route • Drag to Pan • Scroll to Zoom
      </div>
    </div>
  );
};
