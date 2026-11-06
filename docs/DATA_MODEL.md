# AI Agent Office HQ: Data Model

## Authorities and Trust Boundaries

- **State Authority**: The Next.js server runtime controls reads and writes to the local persistence directory (`data/` and `radar/`).
- **Browser/Client Boundary**: The browser client receives projections of agent states, memory entries, and pending approvals. It cannot execute arbitrary server-side actions without going through validated route handlers.
- **Audit Immutability**: Once an approval transition (`approved` or `rejected`) is committed, its status, timestamp, reviewer, and resolution comments cannot be modified.

## Entities

### 1. `AgentProfile`
- **Purpose**: Defines a department agent persona, desk coordinates, model tier, tools, and guardrails.
- **Fields**:
  - `id`: string (primary key, e.g. `'research'`, `'dev'`)
  - `name`: string (e.g. `'Research Lead'`)
  - `department`: string (e.g. `'Research'`)
  - `modelTier`: `'opus' | 'sonnet' | 'haiku'`
  - `deskCoordinates`: `{ x: number, y: number }` (canvas tile coordinates)
  - `color`: string (hex color for UI indicators)
  - `brief`: `{ whoYouAre: string, job: string, mustNeverDo: string }`
  - `allowedTools`: string[]
  - `disallowedTools`: string[]
  - `status`: `'idle' | 'thinking' | 'working' | 'awaiting_approval' | 'error'`
  - `currentTask`?: string
  - `speechBubble`?: string

### 2. `MemoryEntry` (The Shared Brain)
- **Purpose**: Central knowledge artifact readable and writable by all agents.
- **Fields**:
  - `id`: string (UUID)
  - `agentId`: string (author agent ID)
  - `title`: string
  - `content`: string
  - `tags`: string[] (e.g. `['github', 'trends', 'brand_guidelines']`)
  - `createdAt`: string (ISO 8601 timestamp)

### 3. `HITLApproval` (Human-in-the-Loop Queue)
- **Purpose**: Pending sensitive mutation awaiting operator approval before execution.
- **Fields**:
  - `id`: string (UUID)
  - `agentId`: string (requesting agent)
  - `actionType`: string (e.g. `'shopify_refund'`, `'social_publish'`, `'email_send'`)
  - `title`: string
  - `description`: string
  - `riskLevel`: `'low' | 'medium' | 'high' | 'critical'`
  - `payload`: Record<string, any>
  - `status`: `'pending' | 'approved' | 'rejected'`
  - `createdAt`: string (ISO 8601 timestamp)
  - `resolvedAt`?: string
  - `resolvedBy`?: string
  - `resolutionComment`?: string
  - `executionReceipt`?: Record<string, any>

### 4. `RadarItem` (GitHub Radar)
- **Purpose**: Scored trending repository record.
- **Fields**:
  - `id`: string (e.g. `'pixel-agents-hq/pixel-agents'`)
  - `repo`: string
  - `description`: string
  - `stars`: number
  - `starsGrowth`: number
  - `topic`: `'ai-agents' | 'memory' | 'video' | 'voice'`
  - `score`: number (0 - 100)
  - `url`: string
  - `lastScannedAt`: string (ISO 8601)

## Access Matrix

| Resource / Action | Browser Anonymous | Web Operator | Office Lead | Department Sub-Agent |
|---|---|---|---|---|
| View Office Floor / Agents | Allow (Read-only) | Allow | Allow | Allow |
| Trigger Task / Simulation | Deny | Allow | Allow | Deny |
| Read Shared Brain | Allow | Allow | Allow | Allow |
| Write Shared Brain | Deny | Allow | Allow | Allow |
| View Pending Approvals | Deny | Allow | Allow | Read-own |
| Approve / Reject HITL Action | Deny | Allow | Deny | Deny |
| Trigger Radar Scan | Deny | Allow | Allow | Deny |

## Writes and Concurrency

- **Atomic File Updates**: Data files in `data/*.json` are written atomically via temp files and rename operations to prevent partial reads or corruptions.
- **State Transition Guard**: An approval action validates that the current record status is strictly `'pending'`. Concurrent requests on an already resolved action return a `409 Conflict`.
