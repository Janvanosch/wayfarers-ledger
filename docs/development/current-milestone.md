# Current Milestone

**Status:** Active  
**Started:** 2026-07-24  
**Target Version:** v0.1.0

---

# Milestone

## Foundation

The goal of this milestone is to establish the technical foundation of The Wayfarer's Ledger.

No production features should be considered complete until this milestone has been finished.

---

# Objectives

Complete the following foundations.

## Documentation

- [x] Project Bible
- [x] Documentation structure
- [x] Development documentation
- [x] Keeper Log
- [x] First ADR (ADR-001 — Use Electron, ADR-002 — Use sql.js)

---

## Project Structure

- [x] React project
- [x] TypeScript
- [x] Vite
- [x] Routing
- [x] Feature-first folder structure
- [x] Electron application shell (see ADR-001)

---

## Design System

- [x] Colour palette
- [x] Typography
- [x] Spacing system
- [x] Buttons
- [x] Cards
- [ ] Icons
- [ ] Forms
- [x] Layout components (Container, Stack, Surface)

---

## Core Infrastructure

- [x] SQLite integration (sql.js — see ADR-002)
- [x] Repository pattern
- [x] Local storage abstraction (the Vault: folder picker, structure, remembered path)
- [ ] Image storage (Photos folder exists in the Vault structure; import/checksum logic not yet built — no feature needs it yet)
- [x] UUID generation
- [x] Logging
- [x] Settings management

---

## First Features

The first functional feature should be the Home page.

The Home page will introduce the overall visual language of the application.

Initial sections include:

- Home Hero
- Quick Actions
- Recent Journey

---

# Definition of Done

This milestone is complete when:

- documentation is complete
- the design system exists
- the application architecture is stable
- the first reusable components exist
- the Home page has been implemented
- the project is ready for feature development

---

# Current Focus

The Foundation milestone is essentially complete. A Wayfarer can now go
through first-run setup, get a real `.ledger` file created in a Vault folder
of their choosing (verified working inside their own Dropbox folder), and
have the app remember and reopen it automatically on every future launch.

Remaining open items (Icons, Forms polish, Image storage) are deliberately
deferred until a feature actually needs them, per Progressive Completion.

---

# Next Task

Decide the first real feature to build against this foundation (the Gear
Library is the natural first candidate per the Phase 2 roadmap) and give it
its own repository, following the pattern in `electron/lib/repository.cjs`.

---

# Notes

This document should always describe the current development focus.

When the milestone changes, update this document before starting the next major phase.

## Current Milestone

✅ Project foundation

- [x] Clean Vite project
- [x] Routing
- [x] Folder architecture
- [x] Global styling
- [x] Design tokens
- [x] Reusable UI components (Container, Heading, Text, Stack, Surface, Card, Button, Input)
- [x] Home page layout
- [x] Core infrastructure (SQLite via sql.js, repository pattern, local Vault, Wayfarer onboarding)

⬜ Journey feature foundation (first real feature — Gear Library is the likely candidate)