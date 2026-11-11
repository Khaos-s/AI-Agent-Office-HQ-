# Campus interior design contract

Purpose: help an operator find, inspect, and route the 24 agents without losing sight of the office.

Direction: a calm, inhabited pixel-art studio. A connected isometric floor plate replaces the fragmented wedges; warm wood, mint floors, navy partitions, and department accents distinguish rooms. The central holographic meeting table is the focal point. Larger human sprites, individual workstations, plants, coffee equipment, and gym equipment make each department recognizable.

Scope: shared floor plan and agent placement, canvas renderer, viewport interactions, time-based movement, and the surrounding panel/dock space. Preserve roles, prompts, approval flows, and existing dependencies. No generated image assets or new 3D mode.

Acceptance:
- All 24 agents start inside their assigned rooms; desks and routing destinations use the same layout.
- The overview fits the available canvas at 1440x900 and 390x844. The desktop panel reserves space; the mobile panel can be dismissed.
- Names remain legible, selection is obvious, rooms have consistent geometry, and furniture has correct depth ordering.
- Pointer drag does not select; keyboard and touch users can select agents, zoom, reset, and navigate rooms. Reduced motion disables decorative animation.
- Movement uses elapsed time, survives server polling, and accepts replacement destinations. Invalid or outside-campus coordinates are rejected.
- Loading, disconnected/stale, empty, and ready states are explicit. Existing HITL permissions remain outside the renderer.

Validation: layout/movement unit tests, existing regression suite, production build, rendered desktop/mobile screenshots, keyboard/pointer checks, and offline recovery. Record evidence with the screenshots.
