---
type: index
version: 6
status: active
---
# Brain — Index (Blank-Slate Template)

A procedural vault: it stores *how I decide*, not only what I know. Rules are single lines with IDs; AI loads by tier. Start here: [[ARCHITECTURE]] (`07-meta/ARCHITECTURE.md`) defines the 4-layer system philosophy (Architect, Vault, Agents, Model).

## Loading Tiers (for AI)
| Tier | When | Files |
|---|---|---|
| 0 | always | `07-meta/DIGEST.md`, `07-meta/ARCHITECTURE.md` (fallback `01-identity/OPERATING-PRINCIPLES.md`) |
| 1 | by task domain | `02-domains/<domain>.md` |
| 2 | on judgment calls | `03-heuristics/*`, `04-models/*`, `01-identity/TASTE.md` |
| 3 | only when asked | `05-elicitation/sessions/`, `06-raw/` |

Files with `status: empty` or `draft` are skipped; only `status: active` lines count as rules (BN-05).

## Strict Pre-Flight Requirement (`BN-00` — All 7 Agents Required)
- **Hard Stop Rule (`BN-00`):** Anyone cloning or initializing this Brain Vault **cannot start** any self-assessment (`THE-TEST.md`), launcher (`L-01`–`L-10`), or project review unless all **7 Core Agents** (`PM`, `UX`, `GR`, `SD`, `IR`, `DB`, `SEC`) exist in `agents/` (or `brain/04-agents/`).
- If any of the 7 agent files is missing (`productmanageragent.md`, `uiuxagent.md`, `growthagent.md`, `systemsdesignagent.md`, `integrationagent.md`, `dbaagent.md`, `securityagent.md`), the AI must halt immediately with `GATE: FAIL BN-00 <missing-agent> — Restore all 7 Core Agents before starting`.

## Domain Map (Blank-Slate — 0 Personal Rules)
| Domain | Prefix | File | Active rules | Avg conf | Coverage |
|---|---|---|---|---|---|
| Cybersecurity | CS | [[cybersec]] | 0 (draft) | - | Run [[THE-TEST]] to earn rules |
| Solutions | SO | [[solutions]] | 0 (draft) | - | Run [[THE-TEST]] to earn rules |
| Business Analysis | BA | [[business-analysis]] | 0 (draft) | - | Run [[THE-TEST]] to earn rules |
| UI & Frontend | UI | [[ui-frontend]] | 0 (draft) | - | Run [[THE-TEST]] to earn rules |
| Empathy & Personas | PM | [[empathy-personas]] | Reference framework | - | Empathy Map & Target Personas (`PM-14`, `PM-15`) |
| Authorization | AUTH | [[authorization]] | 0 (draft) | - | Externalized Authorization (PDP/PEP, ABAC) |
| Cross-Domain Heuristics | H / P / RF | [[HEURISTICS]] · [[PATTERNS]] · [[RED-FLAGS]] | 0 (empty) | - | Run [[THE-TEST]] to earn rules |
| Psychology | PSY | [[psychology]] | 0 (draft) | - | Human behavior, biases, cognitive science |
| Economy | ECO | [[economy]] | 0 (draft) | - | Macroeconomics, finance, market trends |
| Philosophy | PHI | [[philosophy]] | 0 (draft) | - | Logic, ethics, epistemology |
| Geopolitics | GEO | [[geopolitics]] | 0 (draft) | - | History, global trade, current events |
| Rhetoric | RHE | [[rhetoric]] | 0 (draft) | - | Vocabulary, persuasion, communication |
| Health | HLT | [[health]] | 0 (draft) | - | Physical, mental, and longevity |

Counts are refreshed by [[GAP-FINDER]]. Add a domain: see [[EXTENDING]] and `02-domains/_TEMPLATE.md`.

## Folders
- `01-identity/` who I am as a practitioner (`ABOUT-ME.md`, `OPERATING-PRINCIPLES.md`, `TASTE.md`) · `02-domains/` per-specialty rules (`CS`, `SO`, `BA`, `UI`, `AUTH`, `empathy-personas.md`, `PSY`, `ECO`, `PHI`, `GEO`, `RHE`, `HLT`, `_TEMPLATE.md`)
- `03-heuristics/` cross-domain judgment (`HEURISTICS.md`, `PATTERNS.md`, `RED-FLAGS.md`) · `04-models/` mental models (`_TEMPLATE.md`)
- `05-elicitation/` protocols & triggers (`THE-TEST.md`, `ELICITATION-PROTOCOL.md`, `QUESTION-BANK.md`, `SCENARIO-BANK.md`, `ARTIFACT-ARCHAEOLOGY.md`, `GAP-FINDER.md`, `LAUNCHERS.md`)
- `06-raw/` candidate staging (`inbox.md`) · `07-meta/` vault governance (`ARCHITECTURE.md`, `DIGEST.md`, `CONVENTIONS.md`, `SYNC-PROTOCOL.md`, `EXTENDING.md`, `NEW-PROJECT-SNIPPET.md`, `brainagent.md`, `check-vault.py`)
- `08-workflows/` slash-command workflows & stats spec (`SIX-COMMANDS.md`, `STATS-ENGINE.md`)
