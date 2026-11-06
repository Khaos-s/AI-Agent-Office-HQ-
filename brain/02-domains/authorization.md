---
domain: authorization
prefix: AUTH
version: 1
status: draft
---
# Externalized Authorization — How I Think

## My first move
In the first 3 seconds of evaluating access control, check whether authorization logic is coupled to application code or database queries instead of externalized to a deterministic Policy Decision Point (PDP).

## Default lens
1. PDP/PEP separation (decision external to enforcement)
2. Attribute-Based Access Control (ABAC) over static role explosion
3. Policy-as-Code (declarative, versioned in git, tested in CI)
4. Runtime derived roles bound to resource context
5. Centralized policy distribution and aggregated decision audit trails

## Rules
Grammar: CV-02. IDs `AUTH-nn`. Mandatory `breaks:` condition for conf ≥ 3. Concrete `ev:` only.

_None yet. Populate from elicitation._
