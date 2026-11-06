# HQ Command & Procedural Brain — Claw3D Redesign Specification

**Date:** 2026-11-06  
**Status:** Approved  
**Target:** 2.5D Isometric & 3D Web Headquarters with Procedural Brain & A* Agent Routing  

---

## 1. Intent and Vision

Transform the AI Agent Office into **EasyUp Software Solution // HQ Command**, a spatial AI operations campus inspired by **Claw3D** and backed by the **Dual-System Procedural Brain** (`brain-template`).

Operators visually monitor, inspect, and route autonomous agents across an interactive isometric campus, enforce Human-in-the-Loop gates at **The Boss Desk // Approvals**, and leverage the **Procedural Brain** for domain intelligence, heuristics, and execution gates.

---

## 2. Key Architecture Elements

### A. Isometric 2.5D / 3D Campus
1. **Central Holographic Command ("The Brain")**:
   - Glowing cyan rotating holographic orb and holographic rings.
   - Central circular dais for scrums, all-hands standups, and executive decisions.
2. **Campus Rooms & Zones**:
   - **Focus Workstations & Server Bay** (Deep Blue / Purple): Server racks, dual-monitor workstations, high-focus coding area.
   - **Pantry & Canteen / All Hands** (Orange): Dining tables, coffee machines, water coolers, break space.
   - **Rec & Gym** (Pink/Red): Treadmills, workout mats, recovery area.
   - **Green & Magenta Work Bays**: Additional engineering desks and review pods.
   - **Exterior Campus**: Asphalt roadway, zebra pedestrian crossing, street markings, campus trees.
3. **Camera & View Controls**:
   - Mode Toggle: `2D View` (Orthographic Isometric) / `3D View` (Perspective).
   - Room Presets: `OVERVIEW`, `FOCUS WORK`, `ALL HANDS`, `PANTRY & CANTEEN`, `REC & GYM`.
   - Pan, Zoom, Reset Camera, and Click-to-Inspect.
4. **Agent Movement & A\* Pathfinding**:
   - Smooth animated walking between rooms and desks using A\* grid navigation.
   - Real-time coordinates update with bobbing animation and name tags (`• Josiah`, `• Julian`, etc.).

### B. HQ Command HUD & Sidebar
1. **Campus Live Counter (`24 ONLINE`)**:
   - `● WORKING` (Green)
   - `● EATING` (Orange)
   - `● IN THE GYM` (Sky Blue)
   - `● IN MEETING` (Magenta)
   - `● ON BREAK` (Yellow)
   - `● ARRIVING` (Blue)
   - `● WAITING ON YOU` (Red — Approvals)
2. **The Boss Desk // Approvals**:
   - Status badge (e.g. `0 PENDING` or `N PENDING`).
   - "All Go-Signals cleared" or interactive review queue with 1-click Approve / Reject.
3. **Agent Inspector & Direct Individual Routing (A\* Walking)**:
   - Horizontal agent selector and detailed card (Avatar, Name, Role, Status, Current Task).
   - Direct routing dispatch buttons:
     - `● Send to Work Desk`
     - `● Send to Pantry / Coffee`
     - `● Send to Gym / Rec`
     - `● Call to Brain (Scrum)`

### C. Procedural Brain Integration (`brain-template`)
1. **The 7-Agent Core Suite (`agents/`)**:
   - `PM` (Product Manager), `UX` (UI/UX), `GR` (Growth), `SD` (Systems Design), `IR` (Integration), `DB` (Database), `SEC` (Security), plus `Founder & Lead Architect` (`Josiah`), `Gian`, `Arwin`, `Nelmar`, `John Lloyd`, `Blaze`, etc.
2. **The Procedural Brain Vault (`brain/`)**:
   - Incorporates `01-identity`, `02-domains` (`cybersec`, `solutions`, `ui-frontend`, `authorization`, etc.), `03-heuristics` (`HEURISTICS`, `PATTERNS`, `RED-FLAGS`), and `08-workflows` (`SIX-COMMANDS`, `STATS-ENGINE`).
   - Shared Brain interface lets operators inspect tacit knowledge, active domain rules, and gate checklists.

