# AI Agent Office HQ: Agent Rules

This document defines project-specific operating instructions and boundaries for AI agents collaborating within the AI Agent Office HQ repository.

## Read first

- `docs/CONTEXT.md`: Product vision, target users, scope, full-stack Next.js stack, and runtime.
- `docs/DATA_MODEL.md`: Entity definitions, trusted boundaries, file persistence, and audit logging.
- `docs/METHODOLOGY.md`: State machine transitions, HITL approval lifecycle, and GitHub Radar scoring methodology.
- `ENGINEERING_GUIDE.md`: Decision guide for architecture, API trust boundaries, and testing.

## Hard Rules

- **One Agent, One Job**: Never violate department role boundaries. Lead routes; Research scans; Scripts drafts; Social stages; Analytics reads metrics; TBX Shop handles orders; Dev codes in worktrees; Inbox triages emails; Creative produces media.
- **Human-in-the-Loop (HITL) Gate**: Any action that is public-facing (publishing social posts, sending external emails) or financial (Shopify refunds, discounts, order cancellations) MUST be routed to the HITL approval queue. Never execute these directly without human sign-off.
- **Client/Server Trust Boundary**: Keep secret keys, internal filesystem access, and privileged operations strictly on the server. Never expose backend tokens to Client Components or `NEXT_PUBLIC_` variables.
- **Deterministic Validation & Auditability**: Validate all input payloads with explicit types and boundaries. Store every HITL approval, rejection, and execution event in an immutable audit log.
- **Self-Healing Persistence**: Local data stores (`data/memory.json`, `data/approvals.json`, `radar/data.json`) must self-heal with valid seed defaults if uninitialized or corrupted.
- **Honest States & No Hallucinated Effects**: Use accurate loading, empty, error, and success states. An agent must never report an action as dispatched or completed without a verified execution receipt.
- **Isolated Worktrees for Dev**: The Dev agent must work inside isolated Git branches/worktrees and submit Pull Requests; pushing unreviewed code directly to `main` is strictly forbidden.
