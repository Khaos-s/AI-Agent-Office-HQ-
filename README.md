# AI Agent Office HQ

> An interactive pixel-art agent office with shared memory, a Human-in-the-Loop approval queue, and scored Radar fixtures. Agent responses and external actions are simulations; production storage and operator sign-in use Supabase.

For Vercel environment variables, database setup, and the first operator account, see [deployment instructions](docs/DEPLOYMENT.md).

---

## Highlights

- 🏢 **Interactive 2D Virtual Office Floor**: Real-time HTML5 Canvas rendering of the office layout with 9 specialized department desks, animated agent characters, glowing monitor state indicators, and reactive speech bubbles.
- 🎯 **One Agent, One Job Protocol**: Strict department briefs, model tier allocation (`Opus`, `Sonnet`, `Haiku`), tool allowlists, and hard guardrails ("What You Must Never Do").
- 🧠 **The Shared Brain (Central Memory)**: Persistent Supabase records in production, with self-healing JSON storage for local development.
- 🛡️ **Human-in-the-Loop (HITL) Gate**: Operator approval decisions with append-only database auditing and clearly labeled sandbox receipts.
- 📡 **GitHub Radar**: Deterministic scoring of sample repositories across focus topics (`ai-agents`, `memory`, `video`, `voice`). Live discovery and scheduled scans are not connected.

---

## Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------+
|                        AI Agent Office HQ (Next.js App)                           |
+-----------------------------------------------------------------------------------+
|  Web Frontend (React 18 + Tailwind CSS + HTML5 2D Canvas)                         |
|  - Virtual Office Floor (Desks, animated agents, speech bubbles, hit-testing)    |
|  - Human-in-the-Loop Queue Modal (Risk badges, payload inspector, approve/reject) |
|  - Shared Brain Explorer (Tag filters, search, commit knowledge)                  |
|  - GitHub Radar Leaderboard (Topic breakdown, star velocity, ranking)             |
+-----------------------------------------------------------------------------------+
|  Server API Routes (/api/...)                                                     |
|  - GET/POST /api/office/state       : Agent statuses, coordinates, tasks          |
|  - GET/POST /api/memory             : Read and write shared brain entries         |
|  - GET/POST /api/approvals          : List and queue sensitive actions            |
|  - PATCH    /api/approvals/[id]     : Approve/reject with conflict checks         |
|  - GET/POST /api/radar/scan         : Trigger and fetch GitHub Radar discoveries  |
+-----------------------------------------------------------------------------------+
|  Local Persistence Layer (Self-Healing JSON Stores)                               |
|  - data/memory.json                 : Shared Brain knowledge records              |
|  - data/approvals.json              : Immutable HITL approvals & audit log        |
|  - radar/data.json                  : Scored trending GitHub repositories         |
+-----------------------------------------------------------------------------------+
```

---

## The 9 Specialized Departments

| Department | Model Tier | Core Responsibility | Hard Guardrail ("Must Never Do") |
|---|---|---|---|
| **Office Lead** | `Opus` | Task decomposition & sub-agent routing | Never executes domain work directly; always coordinates. |
| **Research** | `Sonnet` | GitHub Radar tech tracking & discovery | Never alters production code or public repositories. |
| **Scripts** | `Sonnet` | Documentation, copywriting & fact-checking | Never publishes live content or deletes shared folders. |
| **Social** | `Sonnet` | Brand updates & scheduled post staging | PreToolUse hook strictly blocks direct publishing without HITL sign-off. |
| **Analytics** | `Haiku` | Telemetry & performance metrics | Strictly read-only; never mutates tracking code or DB schemas. |
| **TBX Shop** | `Sonnet` | E-commerce orders, support & inventory | Refunds and discounts trigger HITL approval; never process unreviewed payouts. |
| **Dev** | `Opus` | Feature engineering & automated tests | Works in isolated Git worktrees; never pushes directly to `main` without review. |
| **Inbox** | `Sonnet` | Email triage & partnership inquiries | Never calls `send_message` without human sign-off. |
| **Creative** | `Sonnet` | Programmatic media & video production | Never overwrites raw source footage or deletes assets. |

---

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Running Test Suites

```bash
npm test
```

### 4. Production Build

```bash
npm run build
npm start
```

---

## Repository Structure

```
├── AGENTS.md                  # Project agent operating instructions & hard rules
├── docs/
│   ├── CONTEXT.md             # Purpose, actors, stack, boundaries, delivery
│   ├── DATA_MODEL.md          # Entity definitions, access matrices, atomicity
│   ├── METHODOLOGY.md         # HITL state transitions & Radar scoring formula
│   └── superpowers/           # Design specifications and implementation plans
├── radar/
│   └── data.json              # GitHub Radar trending repositories feed
├── data/                      # Local persistence stores (auto-created & self-healing)
│   ├── memory.json            # Shared Brain collective memory
│   └── approvals.json         # HITL approvals queue & execution audit logs
├── src/
│   ├── app/                   # Next.js App Router (pages & API routes)
│   ├── components/            # UI components (Canvas, Modals, Navbar, Dashboards)
│   ├── lib/                   # Domain engines (Registry, Memory, Approvals, Canvas, Radar)
│   └── types/                 # Shared TypeScript interfaces
└── tests/                     # Vitest unit and integration test suite
```

---

## Engineering Standards

This project adheres to the foundation pack conventions outlined in `ENGINEERING_GUIDE.md`:
- **Deterministic Validation & Auditability**: Untrusted payloads validated at API boundaries; all HITL resolutions are immutable.
- **Client/Server Trust Boundary**: Secrets and file I/O operations are strictly confined to the server.
- **Self-Healing Persistence**: Missing or malformed data files gracefully self-heal with valid seed defaults.
- **Honest States**: No phantom effects or simulated completions without verified execution receipts.
