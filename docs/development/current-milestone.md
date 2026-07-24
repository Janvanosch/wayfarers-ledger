# Current Milestone

**Status:** Active
**Started:** 2026-07-24
**Target Version:** v0.2.0

---

# Milestone

## Core Journey

The Foundation milestone (v0.1.0) is complete: documentation, design system,
Electron application shell, real SQLite-backed Vault storage, and Wayfarer
onboarding all work end to end.

This milestone lets a Wayfarer actually start recording their Journey, per
Phase 2 of the roadmap.

---

# Foundation Milestone (v0.1.0) — Complete

## Documentation

- [x] Project Bible
- [x] Documentation structure
- [x] Development documentation
- [x] Keeper Log
- [x] First ADR (ADR-001 — Use Electron, ADR-002 — Use sql.js)

## Project Structure

- [x] React project
- [x] TypeScript
- [x] Vite
- [x] Routing
- [x] Feature-first folder structure
- [x] Electron application shell (see ADR-001)

## Design System

- [x] Colour palette
- [x] Typography
- [x] Spacing system
- [x] Buttons
- [x] Cards
- [ ] Icons (deferred — build when a feature needs them)
- [ ] Forms polish (Input exists; richer controls deferred)
- [x] Layout components (Container, Stack, Surface)
- [x] Photo-first list pattern (`photo-grid`, `Cover`)

## Core Infrastructure

- [x] SQLite integration (sql.js — see ADR-002)
- [x] Repository pattern
- [x] Local storage abstraction (the Vault: folder picker, structure, remembered path)
- [x] Image storage (`vault.importPhoto`, checksum-named, served via the `wl-vault://` protocol)
- [x] UUID generation
- [x] Logging
- [x] Settings management

---

# Core Journey Objectives

- [x] Gear Library (list, detail, quick-capture create, edit)
- [x] Makers (their own entity, linked from Gear, with quick-create from the Gear form)
- [ ] Outfit Library
- [ ] Festival Library
- [ ] Journal Entries
- [ ] Timeline
- [ ] Basic Search
- [ ] Home Dashboard wired to real data (Recent Journey is still a static empty state)

---

# Definition of Done

This milestone is complete when a Wayfarer can record Gear, Outfits, and
Festivals, write Journal Entries, and see them reflected in a real Timeline —
the minimum needed for the app to function as a genuine field journal rather
than a single-feature demo.

---

# Current Focus

Gear and Makers are built and verified working end to end (real photos, real
relationships, real persistence). Both list pages, detail pages, and the
quick-capture forms follow the same pattern, which the next entities can
reuse directly.

---

# Next Task

Decide the next entity to build — Festivals is the strongest candidate next,
since it would let Gear's "Journey" (which festivals a piece of gear has
been to) start to take real shape, and Outfits reference both Gear and
Festivals so benefits from Festivals existing first.

---

# Notes

This document should always describe the current development focus.

When the milestone changes, update this document before starting the next major phase.
