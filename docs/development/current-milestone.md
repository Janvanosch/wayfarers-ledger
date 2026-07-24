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
- [x] First ADR (ADR-001 — Use Electron)

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

- [ ] SQLite integration
- [ ] Repository pattern
- [ ] Local storage abstraction
- [ ] Image storage
- [ ] UUID generation
- [ ] Logging
- [ ] Settings management

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

Current task:

**Begin Core Infrastructure: SQLite integration and the repository pattern, now that the app runs as an installed Electron application (ADR-001) with real filesystem access.**

---

# Next Task

Implement SQLite access in the Electron main process (e.g. `better-sqlite3`), define the repository pattern the React frontend uses to read/write data via IPC, and wire up the Vault folder picker.

Icons and Forms remain open items in the Design System and can be built as needed by upcoming features rather than up front.

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
- [x] Reusable UI components (Container, Heading, Text, Stack, Surface, Card, Button)
- [x] Home page layout

⬜ Journey feature foundation
⬜ Core infrastructure (SQLite, repository pattern, local vault)