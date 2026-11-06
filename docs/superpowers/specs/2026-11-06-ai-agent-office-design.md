# AI Agent Office HQ — System Design Document

**Date:** 2026-11-06  
**Status:** Approved  
**Target:** Web-based Multi-Agent Virtual Headquarters  

---

## 1. Intent and the Why

Autonomous AI agents become chaotic, siloed, and opaque when operated merely as disjointed command-line scripts or chat threads. A functioning organization requires:
- **Visibility**: Seeing what agents are working on, where they sit, and who is collaborating.
- **Specialization**: "One agent, one job", with strict capability boundaries and guardrails.
- **Unified Knowledge**: A shared brain / central memory where learnings and state are persisted and accessible across all teams.
- **Security & Quality**: A deterministic Human-in-the-Loop (HITL) queue intercepting irreversible, public-facing, or financial actions before execution.
- **Automation**: Continuous background discovery (such as the daily GitHub Radar) that reliably captures intelligence without constant human manual prompting.

The goal is to build **AI Agent Office HQ** as an interactive, web-based operations center that bridges visual 2D simulation with deterministic multi-agent execution.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **Interactive 2D Virtual Office Floor**: Render a top-down pixel-art office floorplan directly in the browser (HTML5 Canvas) displaying department areas (Office Lead, Research, Scripts, Social, Analytics, TBX Shop, Dev, Inbox, Creative), animated agent characters at their desks, speech bubbles, and live status states (`idle`, `thinking`, `working`, `awaiting_approval`, `error`).
2. **Deterministic Agent Registry & Execution Engine**: Define department profiles in structured manifests specifying model tier, role brief ("Who you are", "What your job is", "What you must never do"), allowed tools, and disallowed tools. Execute realistic agent workflows out-of-the-box via a deterministic simulation and task lifecycle engine, with extensible adapters for live LLMs and CLI runners.
3. **The Shared Brain (Memory Layer)**: Persist shared company facts, agent memories, and operational logs with REST endpoints for querying, adding, and syncing memories.
4. **Human-in-the-Loop (HITL) Queue & Safe Execution**: Visual review center for pending sensitive operations (e.g. Shopify discounts, brand deal emails, public social posts). Operations can be approved (triggers sandbox execution handlers and writes immutable audit logs) or rejected with feedback.
5. **Autonomous GitHub Radar & Dashboard**: Autonomous radar routine that analyzes trending GitHub repositories across focus topics (AI agents, memory, video, voice), applies a scoring formula, outputs to `radar/data.json`, and visualizes findings on a dedicated web dashboard.
6. **Project Foundation Pack Conformance**: Fully align repository documentation (`AGENTS.md`, `docs/CONTEXT.md`, `docs/DATA_MODEL.md`, `docs/METHODOLOGY.md`) with the principles of `ENGINEERING_GUIDE.md`.

### Non-Goals
- Building a full commercial CRM or custom Git hosting provider from scratch.
- Forcing external closed-source desktop extensions to view the office (must run natively in any modern web browser).
- Hardcoding real third-party production credentials in source code.

### Anti-Goals
- Allowing agents to execute irreversible financial or public actions without human approval.
- An agent taking over another department's duties or bypassing isolation guardrails.
- Bloated microservices for a single local team; keeping it clean, unified, and immediately runnable.

---

## 3. Constraints

- **Platform & Runtime**: Node.js 18+, Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **Storage**: Clean SQLite / JSON file persistence layer for local-first zero-config operation, with pluggable schema interfaces for Supabase / PostgreSQL (`pgvector`).
- **Security**: Strict trust boundaries. Client components never hold secret keys. Mutations require valid input validation.
- **Operating System**: Windows / cross-platform compatible.

---

## 4. Approaches Considered

### Approach 1: Unified Next.js Full-Stack Application (Selected)
* **Architecture**: A single unified Next.js application powering both the rich browser interface (2D Pixel Office Canvas, HITL Dashboard, Radar, Memory Explorer) and the backend API routes (`/api/office/*`, `/api/memory/*`, `/api/approvals/*`, `/api/radar/*`).
* **Pros**: Zero runtime friction, clean deployment, single dev server command (`npm run dev`), direct adherence to `ENGINEERING_GUIDE.md` server component and API boundary recommendations.
* **Tradeoffs**: Canvas engine and UI state must be engineered natively or via lightweight browser canvas libraries.

### Approach 2: Decoupled Vite SPA + Python/FastAPI Backend
* **Architecture**: Separate React Vite frontend talking over REST/WebSocket to a FastAPI Python backend.
* **Pros**: Native Python for certain agent frameworks (LangChain, Mem0 Python SDK).
* **Tradeoffs**: Requires two concurrent processes and environments (Python virtualenv + Node.js), increased setup friction and maintenance overhead.

### Approach 3: Standalone Pixel-Agents Desktop Process + Static Dashboard
* **Architecture**: Relying exclusively on `npx pixel-agents` coupled with static HTML files.
* **Pros**: Pre-packaged pixel engine.
* **Tradeoffs**: Inflexible for custom web UI integration, difficult to embed custom HITL workflow queues and shared memory explorers within a single unified workspace.

**Decision**: Approach 1 was selected for its cohesion, modern web standards, and full browser accessibility.

---

## 5. System Architecture & Components

```
+-----------------------------------------------------------------------------------+
|                            AI Agent Office HQ (Next.js)                           |
+-----------------------------------------------------------------------------------+
|  Frontend UI (App Router)                                                         |
|  +---------------------------+  +------------------------+  +-------------------+ |
|  |  2D Virtual Office Canvas |  |   HITL Approval Queue  |  |  GitHub Radar UI  | |
|  |  - Desks & Departments    |  |   - Pending actions    |  |  - Topic scores   | |
|  |  - Agent Sprites & Speech |  |   - Approve / Reject   |  |  - data.json feed | |
|  +---------------------------+  +------------------------+  +-------------------+ |
|  +------------------------------------------------------------------------------+ |
|  |  Shared Brain Explorer & Department Agent Registry Profiles                  | |
|  +------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
|  Backend API Routes (/api/...)                                                    |
|  - /api/office/state         : Agent statuses, positions, active tasks            |
|  - /api/approvals            : Queue, approve, reject HITL operations             |
|  - /api/memory               : Read/write shared brain memories & embeddings      |
|  - /api/radar/scan           : Trigger or schedule GitHub Radar scoring           |
|  - /api/agents/run           : Dispatch agent task execution                      |
+-----------------------------------------------------------------------------------+
|  Data Persistence & Local Store                                                   |
|  - Shared Memory Store (data/memory.json or SQLite)                               |
|  - HITL Approvals Store (data/approvals.json or SQLite)                           |
|  - Radar Output (radar/data.json)                                                 |
|  - Department Agent Specs (.claude/agents/*.md & configs)                         |
+-----------------------------------------------------------------------------------+
```

---

## 6. Department Specifications ("One Agent, One Job")

| Department | Model Tier | Core Tools & MCPs | Must Never Do |
|---|---|---|---|
| **Office Lead** | Opus | Spawns sub-agents, reads memory, assigns tasks | Never executes domain work directly; delegates & reviews. |
| **Research** | Sonnet/Haiku | GitHub discovery, WebSearch, memory read/write | Never alters production code or public repositories. |
| **Scripts** | Sonnet | Markdown/Docs drafting, fact checking | Never publishes live or deletes folders. |
| **Social** | Sonnet | Social staging, calendar draft planning | Never posts live without HITL approval. |
| **Analytics** | Haiku/Sonnet | Metrics fetch, query analysis | Strictly read-only; never alters schemas or tracking code. |
| **TBX Shop** | Sonnet | Product drafting, order triage | Refunds/discounts/cancellations trigger HITL gate. |
| **Dev** | Opus/Sonnet | Code edits, git worktree isolation, tests | Never pushes directly to main branch without PR review. |
| **Inbox** | Sonnet | Email triage, draft responses | Never sends email directly without human sign-off. |
| **Creative** | Sonnet | Asset generation, video composition | Never overwrites raw source footage. |

---

## 7. What is Left to the Builder

- Implementing the 2D Office Canvas renderer (department zones, desks, agent movement paths, status bubbles).
- Creating the seed mock data for initial agents, memory records, and pending approvals.
- Implementing the scoring algorithm for the GitHub Radar in TypeScript (`(stars_growth * 0.4) + (topic_relevance * 0.4) + (freshness * 0.2)`).
- Setting up the project foundation files in `docs/` and root `AGENTS.md`.

