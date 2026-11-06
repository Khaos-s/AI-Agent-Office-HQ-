# AI Agent Office HQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, full-stack web-based operations center for AI Agent Office HQ featuring an interactive 2D pixel-art virtual office floor, specialized department agent profiles, a shared brain memory store, a deterministic HITL approval queue, and an autonomous GitHub Radar scoring engine.

**Architecture:** A unified Next.js (App Router) full-stack web application with TypeScript and Tailwind CSS. The frontend renders an interactive HTML5 2D pixel canvas for the virtual headquarters alongside reactive control panels for HITL approvals, shared memory, and GitHub Radar. The backend provides robust API routes backed by clean local file/JSON stores with pluggable adapters for live LLM and external service execution.

**Tech Stack:** Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS, Lucide React, Vitest for unit testing.

**Spec:** `docs/superpowers/specs/2026-11-06-ai-agent-office-design.md`

## Global Constraints

- Platform: Node.js 18+ and Next.js 14+ with App Router and TypeScript.
- Operating System: Full Windows cross-platform compatibility (forward/backward slash safety in paths).
- Security: Never expose secret tokens or private keys to Client Components; validate all untrusted inputs at API boundaries.
- Foundation: All core documentation must conform to the repository foundation pack (`ENGINEERING_GUIDE.md`).

## Review Focus

1. **Empty/Corrupted Store Recovery**: If `data/memory.json` or `data/approvals.json` is missing or contains invalid JSON, the server must self-heal with valid initial seed data rather than throwing 500 errors.
2. **Double Approval / State Collision**: If an operator submits an approval/rejection for an action that has already been resolved (`approved` or `rejected`), the system must reject the mutation with 409 Conflict.
3. **HITL Payload Tampering**: When approving a sensitive transaction (e.g. Shopify refund), the approved payload must strictly match the pending action snapshot without accepting unvetted client alterations.
4. **Radar Missing Fields**: If a scanned repository lacks stars, description, or updated dates, the scoring engine must handle missing fields gracefully without NaN or calculation crashes.
5. **Canvas Bounds & Resolution**: The 2D office canvas must scale crisply on high-DPI screens without blurry pixels and handle window resizes cleanly.

---

## Tasks

### Task 1: Foundation Pack Documentation & Agent Rules Setup

**Files:**
- Create: `AGENTS.md`
- Create: `docs/CONTEXT.md`
- Create: `docs/DATA_MODEL.md`
- Create: `docs/METHODOLOGY.md`

**Interfaces:**
- Consumes: `AGENT_RULES_TEMPLATE.md`, `CONTEXT_TEMPLATE.md`, `DATA_MODEL_TEMPLATE.md`, `METHODOLOGY_TEMPLATE.md`, `ENGINEERING_GUIDE.md`.
- Produces: Concrete operational and architecture specifications in root and `docs/`.

- [ ] **Step 1: Create `AGENTS.md`**
  - Implement project-specific hard rules, trust boundaries, department briefs, and delivery policies based on `AGENT_RULES_TEMPLATE.md`.

- [ ] **Step 2: Create `docs/CONTEXT.md`**
  - Define user actors (Operator, Office Lead, Department Agents), entry points, stack, code map, constraints, and delivery requirements based on `CONTEXT_TEMPLATE.md`.

- [ ] **Step 3: Create `docs/DATA_MODEL.md`**
  - Define data entities (`AgentProfile`, `MemoryEntry`, `HITLApproval`, `RadarItem`), access matrices, atomicity, writes, and backup strategies based on `DATA_MODEL_TEMPLATE.md`.

- [ ] **Step 4: Create `docs/METHODOLOGY.md`**
  - Specify state machines for HITL approvals (`pending` -> `approved` | `rejected`), radar scoring calculation formula, refresh intervals, and verification matrix based on `METHODOLOGY_TEMPLATE.md`.

- [ ] **Step 5: Verify docs exist and link correctly**
  - Run: `powershell -Command "Test-Path AGENTS.md, docs/CONTEXT.md, docs/DATA_MODEL.md, docs/METHODOLOGY.md"`
  - Expected: `True` for all files.

- [ ] **Step 6: Commit**
  - Run: `git add AGENTS.md docs/` && `git commit -m "docs: establish foundation pack specifications"`

---

### Task 2: Project Scaffolding & Dependencies Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `vitest.config.ts`
- Create: `src/app/globals.css`

**Interfaces:**
- Consumes: Node.js npm tooling.
- Produces: Runnable Next.js + Tailwind + Vitest development environment.

- [ ] **Step 1: Configure `package.json`**
  - Define dependencies: `next`, `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`.
  - Dev dependencies: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `vitest`.
  - Scripts: `"dev": "next dev"`, `"build": "next build"`, `"test": "vitest run"`.

- [ ] **Step 2: Install dependencies**
  - Run: `npm install`
  - Expected: Clean install with exit code 0.

- [ ] **Step 3: Configure `tsconfig.json`, `tailwind.config.ts`, and `vitest.config.ts`**
  - Setup TypeScript paths `@/*` -> `./src/*` and Tailwind content matching `./src/**/*.{ts,tsx}`.

- [ ] **Step 4: Verify initial test setup**
  - Create a smoke test `tests/smoke.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  describe('Environment Smoke Test', () => {
    it('verifies test runner is operational', () => {
      expect(true).toBe(true);
    });
  });
  ```
  - Run: `npx vitest run tests/smoke.test.ts`
  - Expected: 1 test passed.

- [ ] **Step 5: Commit**
  - Run: `git add package.json package-lock.json tsconfig.json tailwind.config.ts postcss.config.js next.config.mjs vitest.config.ts src/app/globals.css tests/smoke.test.ts`
  - Run: `git commit -m "chore: scaffold Next.js TypeScript and Vitest environment"`

---

### Task 3: Core Domain Models & Shared Store Engines

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/agent-registry.ts`
- Create: `src/lib/memory-store.ts`
- Create: `src/lib/approvals-store.ts`
- Test: `tests/stores.test.ts`

**Interfaces:**
- Consumes: File system storage in `data/`.
- Produces:
  - `getAllAgents(): AgentProfile[]`
  - `getAgentById(id: string): AgentProfile | undefined`
  - `updateAgentStatus(id: string, status: AgentStatus, currentTask?: string): AgentProfile`
  - `getMemories(tag?: string): MemoryEntry[]`
  - `addMemory(entry: Omit<MemoryEntry, 'id' | 'createdAt'>): MemoryEntry`
  - `getApprovals(status?: ApprovalStatus): HITLApproval[]`
  - `createApproval(item: Omit<HITLApproval, 'id' | 'createdAt' | 'status'>): HITLApproval`
  - `resolveApproval(id: string, status: 'approved' | 'rejected', reviewer: string, comment?: string): HITLApproval`

- [ ] **Step 1: Write failing test in `tests/stores.test.ts`**
  - Test memory storage retrieval, duplicate tags, approval resolution, double-approval conflict prevention, and self-healing from missing files.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `npx vitest run tests/stores.test.ts`
  - Expected: FAIL with missing modules.

- [ ] **Step 3: Implement `src/types/index.ts`**
  - Declare types: `AgentRole`, `AgentStatus`, `AgentProfile`, `MemoryEntry`, `HITLApproval`, `ApprovalStatus`, `RadarItem`.

- [ ] **Step 4: Implement `src/lib/agent-registry.ts`**
  - Seed 9 departments: Lead, Research, Scripts, Social, Analytics, TBX Shop, Dev, Inbox, Creative with desks, colors, tools, and guardrails.

- [ ] **Step 5: Implement `src/lib/memory-store.ts` & `src/lib/approvals-store.ts`**
  - Implement atomic reads/writes to `data/memory.json` and `data/approvals.json` with self-healing seeds and conflict prevention.

- [ ] **Step 6: Run tests to verify they pass**
  - Run: `npx vitest run tests/stores.test.ts`
  - Expected: PASS all tests.

- [ ] **Step 7: Commit**
  - Run: `git add src/types/ src/lib/ tests/stores.test.ts`
  - Run: `git commit -m "feat: implement agent registry, shared memory store, and approvals store"`

---

### Task 4: Backend API Routes & HITL Action Execution Handlers

**Files:**
- Create: `src/lib/action-handlers.ts`
- Create: `src/app/api/office/state/route.ts`
- Create: `src/app/api/memory/route.ts`
- Create: `src/app/api/approvals/route.ts`
- Create: `src/app/api/approvals/[id]/route.ts`
- Test: `tests/api-handlers.test.ts`

**Interfaces:**
- Consumes: Task 3 stores and `src/lib/action-handlers.ts`.
- Produces: REST endpoints for office state, memories, and approvals.

- [ ] **Step 1: Write failing test in `tests/api-handlers.test.ts`**
  - Test action execution handlers (Shopify refund receipt, social post dispatch, email delivery receipt), and status transition checks.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `npx vitest run tests/api-handlers.test.ts`
  - Expected: FAIL with missing handler module.

- [ ] **Step 3: Implement `src/lib/action-handlers.ts`**
  - Implement sandboxed dispatchers for `shopify_refund`, `social_publish`, `email_send` producing verified execution receipts and immutable audit logs.

- [ ] **Step 4: Implement Route Handlers**
  - `GET /api/office/state` & `POST /api/office/state`
  - `GET /api/memory` & `POST /api/memory`
  - `GET /api/approvals` & `POST /api/approvals`
  - `PATCH /api/approvals/[id]` (handles approve/reject with validation and conflict checks).

- [ ] **Step 5: Run tests to verify they pass**
  - Run: `npx vitest run tests/api-handlers.test.ts`
  - Expected: PASS all tests.

- [ ] **Step 6: Commit**
  - Run: `git add src/lib/action-handlers.ts src/app/api/ tests/api-handlers.test.ts`
  - Run: `git commit -m "feat: add API routes and HITL execution handlers"`

---

### Task 5: GitHub Radar Scoring Engine & Data Generator

**Files:**
- Create: `src/lib/radar-engine.ts`
- Create: `radar/data.json`
- Create: `src/app/api/radar/scan/route.ts`
- Test: `tests/radar.test.ts`

**Interfaces:**
- Consumes: Focus topics (`AI agents`, `memory`, `video`, `voice`) and scoring weights.
- Produces:
  - `calculateRadarScore(repo: RepoMetrics): number`
  - `runRadarScan(): Promise<RadarItem[]>`
  - `GET /api/radar/scan` & `POST /api/radar/scan`

- [ ] **Step 1: Write failing test in `tests/radar.test.ts`**
  - Test scoring formula `(starsGrowth * 0.4) + (topicRelevance * 0.4) + (freshness * 0.2)`, edge cases (0 stars, missing descriptions), and sorting.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `npx vitest run tests/radar.test.ts`
  - Expected: FAIL with missing module.

- [ ] **Step 3: Implement `src/lib/radar-engine.ts`**
  - Implement scoring calculations, keyword weight analyzers, and seed discovery repositories (e.g. `pixel-agents`, `mem0`, `graphiti`, `remotion`, `claude-code`).

- [ ] **Step 4: Seed `radar/data.json` and create route `/api/radar/scan`**
  - Wire up persistence and expose API endpoint.

- [ ] **Step 5: Run tests to verify they pass**
  - Run: `npx vitest run tests/radar.test.ts`
  - Expected: PASS all tests.

- [ ] **Step 6: Commit**
  - Run: `git add src/lib/radar-engine.ts radar/data.json src/app/api/radar/ tests/radar.test.ts`
  - Run: `git commit -m "feat: implement GitHub Radar scoring engine and API"`

---

### Task 6: Interactive 2D Virtual Office Canvas Engine

**Files:**
- Create: `src/components/OfficeCanvas.tsx`
- Create: `src/lib/canvas-renderer.ts`

**Interfaces:**
- Consumes: `AgentProfile[]` from Task 3.
- Produces: Interactive React Canvas component rendering pixel-art floorplan, desks, animated agent sprites, speech bubbles, and department click selectors.

- [ ] **Step 1: Implement Canvas Renderer in `src/lib/canvas-renderer.ts`**
  - Define isometric/top-down pixel grid, floor tiles, desks, room dividers, wall boundaries, and sprite animations (idle breathing, typing at desk, walking).
  - Support high-DPI retina scaling.

- [ ] **Step 2: Implement `src/components/OfficeCanvas.tsx`**
  - Canvas React component with click detection for agents, mouseover tooltips, speech bubbles displaying current agent tasks, and department highlight rings.

- [ ] **Step 3: Build verification test**
  - Create `tests/canvas-renderer.test.ts` to verify coordinate transformations and agent hit-test detection.
  - Run: `npx vitest run tests/canvas-renderer.test.ts`
  - Expected: PASS.

- [ ] **Step 4: Commit**
  - Run: `git add src/components/OfficeCanvas.tsx src/lib/canvas-renderer.ts tests/canvas-renderer.test.ts`
  - Run: `git commit -m "feat: build interactive 2D pixel office canvas engine"`

---

### Task 7: Web Dashboard UI, HITL Queue & Control Panels

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/HITLQueueModal.tsx`
- Create: `src/components/MemoryExplorer.tsx`
- Create: `src/components/RadarDashboard.tsx`
- Create: `src/components/AgentDetailModal.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Backend API routes from Tasks 3, 4, 5 and `OfficeCanvas` from Task 6.
- Produces: Polished, responsive single-page command center with tabbed views or split pane navigation.

- [ ] **Step 1: Implement `src/components/Navbar.tsx`**
  - Navigation bar showing HQ status, active agents count, pending HITL alerts badge, and live clock.

- [ ] **Step 2: Implement `src/components/HITLQueueModal.tsx`**
  - Real-time approval cards with risk badges (High/Medium/Low), payload inspector, 1-click Approve / Reject buttons, and audit trail view.

- [ ] **Step 3: Implement `src/components/MemoryExplorer.tsx`**
  - Shared Brain search bar, filter by department tags, and new memory entry creation form.

- [ ] **Step 4: Implement `src/components/RadarDashboard.tsx`**
  - GitHub Radar trending leaderboard, score breakdown bars, topic filters, and "Trigger Scan" button.

- [ ] **Step 5: Assemble `src/app/page.tsx`**
  - Integrate OfficeCanvas, AgentDetailModal, HITLQueue, MemoryExplorer, and RadarDashboard with fluid switching and real-time state polling.

- [ ] **Step 6: Verify development build renders without errors**
  - Run: `npm run build`
  - Expected: Clean production build with all pages and routes compiled successfully.

- [ ] **Step 7: Commit**
  - Run: `git add src/components/ src/app/`
  - Run: `git commit -m "feat: assemble interactive web dashboard and control center"`

---

### Task 8: End-to-End Verification & Project Delivery

**Files:**
- Test: Full Vitest test suite (`tests/*.test.ts`)
- Script: `scripts/test-all.js`
- Modify: `README.md` (Updated with complete project usage guide)

**Interfaces:**
- Consumes: All project files and documentation.
- Produces: Verified, ready-to-run repository.

- [ ] **Step 1: Run all unit and integration tests**
  - Run: `npx vitest run`
  - Expected: All test suites PASS.

- [ ] **Step 2: Run production Next.js build**
  - Run: `npm run build`
  - Expected: Successful compilation with 0 errors.

- [ ] **Step 3: Update `README.md`**
  - Document setup instructions (`npm install`, `npm run dev`), architecture overview, department list, HITL approval flow, and GitHub Radar routine.

- [ ] **Step 4: Final verification and commit**
  - Run: `git status` && `git add README.md` && `git commit -m "docs: finalize project setup and verification"`

