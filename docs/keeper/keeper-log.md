# Keeper Log

**Project:** The Wayfarer's Ledger

**Status:** Active Development

**Last Updated:** 2026-07-24

---

# Purpose

The Keeper Log serves as the living memory of the project.

Unlike the Project Bible, which defines timeless principles, the Keeper Log captures the project's current state.

Every new development session should begin by reading this document.

Its purpose is to answer one simple question:

> "Where do we continue?"

---

# Current Milestone

Foundation (v0.1.0)

The project is currently establishing its technical foundation.

Primary focus:

- documentation
- design system
- reusable architecture
- core infrastructure

No production features are considered complete until this milestone has been finished.

---

# Current Status

## Completed

- Repository created
- React project created
- TypeScript configured
- Vite configured
- React Router configured
- Feature-first folder structure established
- Documentation structure completed
- Project Bible v1.0 completed
- Development documentation established

### 2026-07-24

Completed:
- Removed the default Vite starter assets and styling.
- Created the initial UI component structure.
- Created the global styling architecture.
- Added design tokens for colors, typography, spacing, radius, shadows, and transitions.
- Connected the global stylesheet pipeline through `main.tsx`.
- Fixed a bug where the app rendered a blank page: `AppRoutes` used `<Routes>` without a `<BrowserRouter>` ancestor.
- Built the remaining UI component library: Text, Stack, Surface, Card, Button.
- Rebuilt the Home page (Hero, Quick Actions, Recent Journey) and the app shell (Header, Footer) to use the design system components and tokens exclusively, removing hardcoded colours and spacing.
- Verified the app renders correctly and typechecks cleanly.

- Self-hosted the `Inter` and `Cormorant Garamond` variable fonts (`src/assets/fonts`, loaded via `src/styles/fonts.css`) instead of depending on a Google Fonts CDN, in line with Offline First and Privacy First.
- Realised the Vault promise in Chapter 7 (a real `.ledger` file, saved into a folder the Wayfarer picks, e.g. Dropbox) conflicts with running as a browser-only PWA: browsers restrict writing arbitrary files to disk, and the one workaround (File System Access API) only works in Chrome/Edge.
- Decided, with Jan, to package the app as an installed desktop application instead of a website — see **ADR-001**. Chose Electron over Tauri to avoid introducing a new (Rust) toolchain, at the cost of a larger installed size.
- Added the Electron application shell: `electron/main.cjs` (opens a native window, loads the Vite dev server in development / `dist/index.html` in production) and `electron/preload.cjs` (currently empty, reserved for the future Vault/SQLite bridge). Added `npm run electron:dev` and `npm run electron:build` scripts and an `electron-builder` config in `package.json`.

Next:
- Icons and Forms are still open Design System items; build them when a feature needs them rather than speculatively.
- Implement SQLite in the Electron main process (e.g. `better-sqlite3`) and the repository pattern the React frontend will use to read/write data over IPC, plus the Vault folder picker.

---

## In Progress

Foundation milestone.

---

## Next Task

Begin implementation of the Design System.

The Design System should define:

- colours
- typography
- spacing
- buttons
- cards
- form controls
- layout primitives

Once complete, begin building the Home page using reusable components.

---

# Recent Decisions

## Architecture

- React
- TypeScript
- Vite
- React Router

---

## Philosophy

Offline-first.

Privacy-first.

Feature-first architecture.

Documentation-first development.

---

## Documentation

The Project Bible is considered stable.

Development documents should evolve throughout the project.

---

# Known Issues

None.

---

# Open Questions

None.

Questions that influence architecture or project direction should be recorded here until resolved.

---

# Next Session Checklist

At the beginning of every development session:

1. Read the Project Bible if major design decisions are expected.
2. Read `current-milestone.md`.
3. Read `keeper-log.md`.
4. Continue the current milestone.
5. Update this document before ending the session if significant progress has been made.

---

# Session Summary

The repository now contains:

- a complete Project Bible
- a structured documentation system
- a defined development workflow
- a stable project architecture

The project is ready to begin implementation of the Design System.

---

# Keeper's Notes

The purpose of the Keeper Log is continuity.

It exists so that future development sessions can resume quickly and confidently, without reconstructing project history from previous conversations.