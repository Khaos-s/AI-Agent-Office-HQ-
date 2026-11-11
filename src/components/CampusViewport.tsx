"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AgentProfile, RoomLocation } from "@/types";
import { renderIsometricCampus, getAgentAtIsometricCoords } from "@/lib/isometric-campus-renderer";
import { CAMPUS_WIDTH, CAMPUS_HEIGHT, CAMPUS_ROOMS, project, isInsideCampus } from "@/lib/campus-layout";
import { agentPositionAt } from "@/lib/agent-movement";
import { Minus, Plus, Maximize2, Tags } from "lucide-react";

interface CampusViewportProps {
  currentRoom: RoomLocation;
  agents: AgentProfile[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentProfile | null) => void;
  onRoomChange: (room: RoomLocation) => void;
  onMoveAgentDirectly?: (agentId: string, x: number, y: number) => void;
  connectionState: "loading" | "ready" | "stale";
  serverOffset: number;
}

export const CampusViewport: React.FC<CampusViewportProps> = ({ currentRoom, agents, selectedAgentId, onSelectAgent, onRoomChange, onMoveAgentDirectly, connectionState, serverOffset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const camera = useRef({ zoom: 1, x: 0, y: 0 });
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const drag = useRef<{ id: number; x: number; y: number; panX: number; panY: number; moved: boolean } | null>(null);
  const hovered = useRef<string | null>(null);
  const source = useRef(agents);
  const rendered = useRef(agents);
  const clockOffset = useRef(serverOffset);
  const [names, setNames] = useState(true);
  const [roomId, setRoomId] = useState("overview");
  const [moveMode, setMoveMode] = useState(false);
  source.current = agents;
  clockOffset.current = serverOffset;

  const fit = useCallback((id: string) => {
    const { w, h } = size.current;
    const room = CAMPUS_ROOMS.find(r => r.id === id);
    const zoom = room ? Math.min((w - 64) / 430, (h - 230) / 310, 2.1) : Math.min((w - 32) / CAMPUS_WIDTH, (h - 180) / CAMPUS_HEIGHT);
    const center = room ? project(room.x + 120, room.y + 120) : { x: CAMPUS_WIDTH / 2, y: CAMPUS_HEIGHT / 2 };
    camera.current = { zoom: Math.max(.18, zoom), x: -(center.x - CAMPUS_WIDTH / 2) * zoom, y: -(center.y - CAMPUS_HEIGHT / 2) * zoom - 8 };
  }, []);

  useEffect(() => {
    const id = currentRoom === "overview" ? "overview" : CAMPUS_ROOMS.find(r => r.type === currentRoom)?.id ?? "overview";
    setRoomId(previous => currentRoom !== "overview" && CAMPUS_ROOMS.find(r => r.id === previous)?.type === currentRoom ? previous : id);
  }, [currentRoom]);

  useEffect(() => {
    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    const resize = () => {
      const { width: w, height: h } = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      fit(roomId);
    };
    const ro = new ResizeObserver(resize); ro.observe(container); resize();
    return () => ro.disconnect();
  }, [roomId, fit]);

  const changeZoom = (factor: number) => { camera.current.zoom = Math.max(.18, Math.min(2.5, camera.current.zoom * factor)); };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wheel = (event: WheelEvent) => { event.preventDefault(); changeZoom(Math.exp(-event.deltaY * .001)); };
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => canvas.removeEventListener("wheel", wheel);
  }, []);

  useEffect(() => {
    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const draw = (time: number) => {
      const ctx = canvasRef.current?.getContext("2d");
      const { w, h, dpr } = size.current;
      rendered.current = source.current.map(a => ({ ...a, currentCoordinates: agentPositionAt(a, Date.now() + clockOffset.current) }));
      if (ctx && w && h) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderIsometricCampus(ctx, rendered.current, selectedAgentId, hovered.current, reduced.matches ? 0 : time / 16.67, camera.current.zoom, { x: camera.current.x, y: camera.current.y }, [], w, h, names);
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [selectedAgentId, names]);

  const toWorld = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const { zoom, x, y } = camera.current;
    return { x: (clientX - rect.left - size.current.w / 2 - x) / zoom + CAMPUS_WIDTH / 2, y: (clientY - rect.top - size.current.h / 2 - y) / zoom + CAMPUS_HEIGHT / 2 };
  };

  const reset = () => { setRoomId("overview"); onRoomChange("overview"); fit("overview"); };
  const buttonClass = "flex h-11 w-11 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-amber-200";
  const selected = agents.find(a => a.id === selectedAgentId);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#10262b]">
      <canvas ref={canvasRef} tabIndex={0} role="img" aria-label="Isometric agent office. Drag or use arrow keys to pan. Plus and minus zoom; Home fits the office. Select agents using the roster below." className="absolute inset-0 h-full w-full touch-none outline-offset-[-4px]"
        onPointerDown={e => {
          if (e.button !== 0 || drag.current) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, panX: camera.current.x, panY: camera.current.y, moved: false };
        }}
        onPointerMove={e => {
          if (drag.current) {
            if (drag.current.id !== e.pointerId) return;
            const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
            if (Math.hypot(dx, dy) > 6) drag.current.moved = true;
            if (drag.current.moved) { camera.current.x = drag.current.panX + dx; camera.current.y = drag.current.panY + dy; }
          } else {
            const p = toWorld(e.clientX, e.clientY);
            hovered.current = getAgentAtIsometricCoords(p.x, p.y, rendered.current, camera.current.zoom, names, selectedAgentId)?.id ?? null;
            e.currentTarget.style.cursor = hovered.current ? "pointer" : "grab";
          }
        }}
        onPointerUp={e => {
          if (!drag.current || drag.current.id !== e.pointerId) return;
          const moved = drag.current.moved; drag.current = null;
          e.currentTarget.releasePointerCapture(e.pointerId);
          if (moved) return;
          const p = toWorld(e.clientX, e.clientY);
          if ((e.shiftKey || moveMode) && selectedAgentId && isInsideCampus(p.x, p.y)) {
            onMoveAgentDirectly?.(selectedAgentId, p.x, p.y); setMoveMode(false); return;
          }
          const hit = getAgentAtIsometricCoords(p.x, p.y, rendered.current, camera.current.zoom, names, selectedAgentId);
          if (hit) onSelectAgent(hit);
        }}
        onPointerCancel={e => { if (drag.current?.id === e.pointerId) drag.current = null; }}
        onLostPointerCapture={e => { if (drag.current?.id === e.pointerId) drag.current = null; }}
        onPointerLeave={() => { hovered.current = null; }}
        onKeyDown={e => {
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home", "Escape"].includes(e.key)) e.preventDefault();
          if (e.key === "ArrowLeft") camera.current.x += 40;
          if (e.key === "ArrowRight") camera.current.x -= 40;
          if (e.key === "ArrowUp") camera.current.y += 40;
          if (e.key === "ArrowDown") camera.current.y -= 40;
          if (e.key === "+" || e.key === "=") changeZoom(1.2);
          if (e.key === "-") changeZoom(1 / 1.2);
          if (e.key === "Home") reset();
          if (e.key === "Escape") setMoveMode(false);
        }}
      />
      <div className="pointer-events-none absolute left-5 top-5 sm:left-7 sm:top-6">
        <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#9fbbb6]">EasyUp / Workspace 01</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#edf3e7] sm:text-2xl">A place for great minds.</h1>
        <p role="status" className="mt-2 flex items-center gap-2 text-[11px] text-[#b4cbc5]">
          <span className={`h-1.5 w-1.5 rounded-full ${connectionState === "ready" ? "bg-[#aed6a3]" : "bg-amber-300"}`} />
          {connectionState === "loading" ? "Loading campus…" : connectionState === "stale" ? "Connection paused · showing last known state" : agents.length ? `${agents.length} agents · 9 spaces · One shared brain` : "No agents in this campus"}
        </p>
      </div>
      <div className="absolute bottom-[104px] left-4 right-4 flex items-end justify-between gap-2 sm:bottom-[94px] sm:left-6 sm:right-6">
        <div className="flex max-w-[calc(100%-58px)] flex-col gap-2">
          <label className="sr-only" htmlFor="campus-room">Explore a room</label>
          <select id="campus-room" value={roomId} onChange={e => { setRoomId(e.target.value); onRoomChange(CAMPUS_ROOMS.find(r => r.id === e.target.value)?.type ?? "overview"); }} className="h-11 max-w-full rounded-lg border border-white/15 bg-[#132d34] px-3 text-xs text-[#e2ecdf]">
            <option value="overview">↗ Entire office</option>
            {CAMPUS_ROOMS.map((r, i) => <option key={r.id} value={r.id}>{String(i + 1).padStart(2, "0")} / {r.name}</option>)}
          </select>
          <label className="sr-only" htmlFor="campus-agent">Select an agent</label>
          <select id="campus-agent" value={selectedAgentId ?? ""} disabled={!agents.length} onChange={e => onSelectAgent(agents.find(a => a.id === e.target.value) ?? null)} className="h-11 max-w-full rounded-lg border border-white/15 bg-[#132d34] px-3 text-xs text-[#e2ecdf]">
            <option value="" disabled>Select an agent</option>
            {agents.map(a => <option key={a.id} value={a.id}>{a.name} · {a.department}</option>)}
          </select>
          <button disabled={!selected} aria-pressed={moveMode} onClick={() => setMoveMode(!moveMode)} className="h-11 rounded-lg border border-white/15 bg-[#132d34] px-3 text-left text-xs text-[#e2ecdf] disabled:opacity-40">
            {moveMode ? "Choose a floor tile · Cancel" : `Move ${selected?.name ?? "agent"}`}
          </button>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-white/15 bg-[#132d34]/95 p-1 shadow-xl">
          <button aria-label="Zoom in" onClick={() => changeZoom(1.25)} className={buttonClass}><Plus size={17} /></button>
          <button aria-label="Zoom out" onClick={() => changeZoom(.8)} className={buttonClass}><Minus size={17} /></button>
          <button aria-label="Fit entire office" onClick={reset} className={buttonClass}><Maximize2 size={16} /></button>
          <button aria-label="Show agent names" aria-pressed={names} onClick={() => setNames(!names)} className={`${buttonClass} ${names ? "bg-white/10" : ""}`}><Tags size={16} /></button>
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-3 left-6 hidden text-[10px] tracking-wide text-[#9bb5af] sm:block">DRAG TO EXPLORE <span className="mx-2 opacity-40">/</span> SCROLL TO ZOOM <span className="mx-2 opacity-40">/</span> SELECT AN AGENT TO CONNECT</p>
    </div>
  );
};
