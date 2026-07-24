# Architectural Decision Records (ADR)

Architectural Decision Records document important technical decisions made during the development of **The Wayfarer's Ledger**.

The purpose of an ADR is to explain **why** a decision was made, not simply **what** was implemented.

---

# When to Create an ADR

Create an ADR whenever a decision is expected to have long-term consequences.

Examples include:

- choosing a database
- selecting a framework
- deciding on an application architecture
- introducing a major dependency
- defining a storage format
- changing the synchronization strategy

Small implementation details do not require an ADR.

---

# ADR Naming

Each ADR receives a sequential number.

Examples:

```
001-use-react.md
002-use-sqlite.md
003-feature-first-architecture.md
```

Numbers are never reused.

If an ADR is superseded, create a new ADR rather than editing history.

---

# ADR Template

Every ADR should follow this structure.

```md
# ADR-XXX — Title

**Status:** Proposed | Accepted | Superseded

**Date:** YYYY-MM-DD

---

## Context

Describe the problem.

---

## Options Considered

- Option A
- Option B
- Option C

---

## Decision

Describe the chosen solution.

---

## Consequences

Positive:

-

Negative:

-
```

---

# Status Values

An ADR may have one of the following states.

## Proposed

The decision is still under discussion.

---

## Accepted

The decision has been implemented or officially adopted.

---

## Superseded

A newer ADR has replaced this decision.

The old ADR remains for historical context.

---

# Philosophy

Architecture should evolve carefully.

Recording important decisions prevents future contributors from repeating the same discussions.

A good ADR captures the reasoning behind a decision, making the project easier to understand years later.

---

# Keeper's Notes

The Wayfarer's Ledger values simplicity.

Create ADRs sparingly.

Only decisions with lasting architectural impact deserve permanent documentation.