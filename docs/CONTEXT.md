# AI Agent Office HQ: Context

## Purpose

- **Intended user**: Operators, team leads, and developers managing a distributed fleet of specialized autonomous AI agents.
- **Job**: Provide a unified visual 2D headquarters and real-time operations dashboard to monitor agents, inspect the shared memory brain, review sensitive actions via a Human-in-the-Loop (HITL) gate, and track trending technology via an autonomous GitHub Radar.
- **Evidence**: Operating multi-agent systems purely via disconnected terminal processes leads to lack of visibility, coordination failures, and high risk of unreviewed public or financial actions.
- **First release**: Interactive 2D pixel-art virtual office floor in browser canvas, 9 specialized department profiles, a shared brain memory store, a deterministic HITL approval queue with simulated execution receipts, and a GitHub Radar scoring dashboard.
- **Exclusions**: Full multi-tenant SaaS billing, custom Git forge hosting, and uncontrolled direct live external API mutations without operator credentials.

## Users and Access

| Actor | Entry Point | Allowed Actions | Forbidden Actions |
|---|---|---|---|
| **Human Operator** | Web Browser (`/`) | View office canvas, inspect agent states, approve/reject HITL queue items, add/search shared memories, trigger Radar scans | Cannot bypass audit logging or execute actions without record |
| **Office Lead Agent** | Internal Router / API | Decompose complex tasks, assign sub-agents to department desks, review outputs | Never executes domain work directly; cannot bypass HITL gate |
| **Department Sub-Agents** | Task Dispatch Engine | Read/write shared brain, report progress status, stage actions for review | Cannot execute sensitive/financial tools directly without HITL approval |

## Stack and Runtime

- **Framework**: Next.js 14+ (App Router), React 18+, TypeScript.
- **Styling**: Tailwind CSS with custom pixel-art and HUD palette.
- **Icons**: Lucide React.
- **Persistence**: Local JSON stores (`data/memory.json`, `data/approvals.json`, `radar/data.json`) with atomic file writes and self-healing initialization; designed for seamless migration to Supabase/PostgreSQL.
- **Testing**: Vitest for unit, store, API, and calculation verification.
- **Runtime**: Node.js 18+ on Windows / macOS / Linux.

## Code Map

- `src/app/page.tsx`: Main command center composing the virtual office floor and control modules.
- `src/components/OfficeCanvas.tsx`: Interactive HTML5 2D pixel canvas rendering the floorplan, desks, agents, and speech bubbles.
- `src/components/HITLQueueModal.tsx`: Visual approval queue with risk ratings, payload inspector, and 1-click decision controls.
- `src/components/MemoryExplorer.tsx`: Shared Brain knowledge base explorer and memory insertion interface.
- `src/components/RadarDashboard.tsx`: GitHub Radar trending repo leaderboard with scoring breakdowns.
- `src/lib/agent-registry.ts`: The 9 department agent definitions and guardrails.
- `src/lib/memory-store.ts`: Central memory storage engine.
- `src/lib/approvals-store.ts`: HITL state store with collision prevention and audit logs.
- `src/lib/action-handlers.ts`: Sandboxed execution dispatchers for approved transactions.
- `src/lib/radar-engine.ts`: Scoring algorithm for GitHub trending repositories.

## Current Decisions and Limitations

- Out-of-the-box operation runs on an interactive deterministic simulation engine with realistic agent task lifecycles, enabling full end-to-end testing without paid LLM API costs.
- Pluggable adapters allow connecting live Claude/Anthropic APIs or Claude Code CLI runners via environment configuration.
- Approved HITL actions execute via sandboxed handlers generating verified receipts, preventing unintended live charges during local evaluation.

## Delivery

- `npm install`: Install dependencies.
- `npm run dev`: Launch local development server on `http://localhost:3000`.
- `npm test`: Run complete Vitest suite.
- `npm run build`: Compile production Next.js build.

