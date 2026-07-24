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
- [x] Outfit Library, with real version history (Outfit = stable identity, Version = immutable snapshot of Gear + notes)
- [x] Journey hub page (`/journey`) with a working Festival Library (list, detail, quick-capture create, edit) and Gear↔Festival "Seen at" linking
- [ ] Journal Entries
- [ ] Timeline
- [ ] Basic Search
- [ ] Global Capture (+) button
- [ ] Home Dashboard wired to real data (Recent Journey is still a static empty state)

---

# Definition of Done

This milestone is complete when a Wayfarer can record Gear, Outfits, and
Festivals, write Journal Entries, and see them reflected in a real Timeline —
the minimum needed for the app to function as a genuine field journal rather
than a single-feature demo.

---

# Current Focus

Gear, Makers, Festivals, and Outfits (with version history) are all built
and verified working end to end (real photos, real relationships, real
persistence, real version snapshots).

A mobile phase has been agreed as the next major phase after Core Journey,
since capturing memories while walking around a festival — not sitting at a
desktop — is the actual point of the app. It is deliberately sequenced
*after* a bit more of the core feature set, not before, since the frontend
(everything talking to `window.ledger.*`) should carry over largely as-is,
while the storage engine needs a genuinely different, mobile-appropriate
approach (see the Keeper Log for the reasoning).

---

# Next Task

Journal Entries and Timeline are the remaining pieces of the Journey hub.
The global Capture (+) button (Chapter 4) is also still open, and is a
natural candidate before or alongside starting the mobile phase.

---

# Notes

This document should always describe the current development focus.

When the milestone changes, update this document before starting the next major phase.
