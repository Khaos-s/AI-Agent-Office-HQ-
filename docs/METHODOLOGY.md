# AI Agent Office HQ: Workflows and Calculations

## Workflow: Human-in-the-Loop (HITL) Gate

The lifecycle of an action requiring operator approval follows a strict state machine:

| Current State | Action | Authorized Actor | Preconditions | Next State / Effects |
|---|---|---|---|---|
| *None* | `createApproval` | Department Agent | Tool is in sensitive/financial category | `pending`: Item queued in `data/approvals.json`; agent enters `awaiting_approval` status with speech bubble |
| `pending` | `approveAction` | Web Operator | Item is `pending` | `approved`: Executes sandbox action handler, records `executionReceipt` and `resolvedAt`, agent transitions to `working` |
| `pending` | `rejectAction` | Web Operator | Item is `pending` | `rejected`: Execution is aborted, logs feedback comment, agent transitions to `idle` |
| `approved` | *Any* | *Any* | *Terminal state* | Rejected with `409 Conflict: Action already approved` |
| `rejected` | *Any* | *Any* | *Terminal state* | Rejected with `409 Conflict: Action already rejected` |

## Derived Values: GitHub Radar Scoring Formula

Each repository evaluated by the GitHub Radar routine is scored on a normalized scale of 0 to 100 using the following formula:

$$\text{Radar Score} = (\text{Stars Growth Normalized} \times 0.40) + (\text{Topic Relevance} \times 0.40) + (\text{Freshness} \times 0.20)$$

### Input Components:
1. **Stars Growth ($\text{SG}$)**:
   - Measures recent velocity. Normalized to $[0, 100]$:
     $$\text{SG}_{\text{norm}} = \min(100, \frac{\text{stars\_growth\_week}}{500} \times 100)$$
2. **Topic Relevance ($\text{TR}$)**:
   - Keyword density match across repo title, tags, and description for target topics (`ai-agents`, `memory`, `video`, `voice`).
   - Direct topic match = 100; secondary keyword match = 70; tangential match = 40.
3. **Freshness ($\text{F}$)**:
   - Days since last commit ($D$):
     $$\text{F} = \max(0, 100 - (D \times 5))$$

### Edge Cases:
- Missing description: defaults to topic keyword presence in repo name.
- Negative or zero star growth: normalized to 0 (never negative).
- Max score capped at 100.

## Freshness and Asynchronous Routines

- **GitHub Radar**: Defaults to automatic 6:00 AM daily scans, with manual on-demand trigger available from the web dashboard.
- **Office Canvas Polling**: Client polls `/api/office/state` every 2,500ms to update character positions, speech bubbles, and queue badges without page reloads.

## Verification Matrix

- **Unit Tests**: Store read/write atomicity, self-healing from corrupted files, duplicate tags handling, and radar scoring formula edge cases.
- **API Tests**: State transition guards, 409 conflict on double approvals, and input boundary validations.
- **Build Verification**: `npm run build` production compilation check with TypeScript typing.

