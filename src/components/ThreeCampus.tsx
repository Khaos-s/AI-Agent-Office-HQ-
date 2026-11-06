"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { AgentProfile } from "@/types";

interface ThreeCampusProps {
  agents: AgentProfile[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentProfile | null) => void;
}

export const ThreeCampus: React.FC<ThreeCampusProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 960;
    const height = mount.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050b14");
    scene.fog = new THREE.FogExp2("#050b14", 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    // Isometric camera angle
    camera.position.set(45, 55, 65);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(40, 60, 40);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.5, 40);
    cyanLight.position.set(0, 5, 0);
    scene.add(cyanLight);

    // 3. Ground / Campus Floor
    const floorGeo = new THREE.PlaneGeometry(120, 100);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor grid
    const grid = new THREE.GridHelper(120, 40, 0x1e293b, 0x0f172a);
    grid.position.y = 0.05;
    scene.add(grid);

    // 4. Central Holographic Command Orb (The Brain)
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Holographic Core Sphere
    const sphereGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 5;
    brainGroup.add(sphere);

    // Glowing Holographic Rings
    const ringGeo1 = new THREE.TorusGeometry(5, 0.08, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.position.y = 5;
    ring1.rotation.x = Math.PI / 3;
    brainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(6, 0.08, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.position.y = 5;
    ring2.rotation.y = Math.PI / 4;
    brainGroup.add(ring2);

    // Circular Dais
    const daisGeo = new THREE.CylinderGeometry(10, 11, 0.5, 32);
    const daisMat = new THREE.MeshStandardMaterial({ color: 0x050b14, roughness: 0.5 });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = 0.25;
    scene.add(dais);

    // 5. Room Dividers / Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

    const createWall = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
    };

    // Perimeter walls
    createWall(80, 4, 1, 0, 2, -35); // back wall
    createWall(80, 4, 1, 0, 2, 35);  // front wall
    createWall(1, 4, 70, -40, 2, 0); // left wall
    createWall(1, 4, 70, 40, 2, 0);  // right wall

    // 6. Agents in 3D Space
    const agentMeshes: Map<string, THREE.Group> = new Map();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let current: THREE.Object3D | null = intersects[0].object;
        while (current && current.parent && current.parent !== scene) {
          const agentId = current.userData?.agentId;
          if (agentId) {
            const found = agents.find((a) => a.id === agentId);
            if (found) {
              onSelectAgent(found);
              return;
            }
          }
          current = current.parent;
        }
      }
    };

    renderer.domElement.addEventListener("click", handleCanvasClick);

    // 7. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate Holographic Brain
      sphere.rotation.y += 0.015;
      sphere.rotation.x += 0.008;
      ring1.rotation.z += 0.02;
      ring2.rotation.x -= 0.018;

      // Update / Sync Agent Mesh Positions
      for (const agent of agents) {
        let group = agentMeshes.get(agent.id);

        if (!group) {
          group = new THREE.Group();
          group.userData = { agentId: agent.id };

          // 3D Agent Figure
          const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
          const bodyMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(agent.color),
            roughness: 0.4,
          });
          const body = new THREE.Mesh(bodyGeo, bodyMat);
          body.position.y = 1;
          group.add(body);

          // Head
          const headGeo = new THREE.SphereGeometry(0.7, 16, 16);
          const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa });
          const head = new THREE.Mesh(headGeo, headMat);
          head.position.y = 2.4;
          group.add(head);

          scene.add(group);
          agentMeshes.set(agent.id, group);
        }

        // Map 2D coordinates (x: 0..960, y: 0..640) to 3D world (x: -45..45, z: -30..30)
        const targetX = ((agent.currentCoordinates.x - 480) / 480) * 38;
        const targetZ = ((agent.currentCoordinates.y - 320) / 320) * 26;

        // Smooth interpolation
        group.position.x += (targetX - group.position.x) * 0.1;
        group.position.z += (targetZ - group.position.z) * 0.1;
        group.position.y = Math.sin(elapsed * 4 + agent.id.length) * 0.1;

        // Selection highlight
        if (agent.id === selectedAgentId) {
          group.scale.set(1.2, 1.2, 1.2);
        } else {
          group.scale.set(1.0, 1.0, 1.0);
        }
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      mount.removeChild(renderer.domElement);
    };
  }, [agents, selectedAgentId, onSelectAgent]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[540px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-slate-950 border border-slate-800 shadow-2xl relative"
    >
      <div className="absolute top-3 left-4 text-xs font-mono text-cyan-400 bg-slate-900/80 px-2.5 py-1 rounded border border-cyan-500/30 backdrop-blur z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>Three.js 3D WebGL Spatial Campus</span>
      </div>
    </div>
  );
};

