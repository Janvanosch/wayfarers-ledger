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

- Attempted `better-sqlite3` for the Ledger database; it requires a native compiler toolchain (Python + a C++ compiler) not present on this machine, which would have undercut the whole point of choosing Electron over Tauri. Switched to `sql.js` (WebAssembly SQLite, no native compilation) — see **ADR-002**.
- Built the Core Infrastructure layer in `electron/lib/`: `logger.cjs`, `settings.cjs` (app config, separate from Vault data), `ids.cjs` (`prefix_XXXXXX` IDs matching the Bible's examples), `database.cjs` (sql.js open/save/migrations), `repository.cjs` (generic create/findById/findAll/update/softDelete factory), `vault.cjs` (folder picking, Vault structure, Ledger file creation/reopening), and `ipc.cjs` wiring it all to the renderer via `preload.cjs`'s `window.ledger` API.
- Built the first-run onboarding screen (`src/pages/VaultSetup`) and a new `Input` component. A Wayfarer can now either create a new Vault (name + folder picker) or open an existing one.
- Verified the entire flow for real, end to end: created a Vault in Jan's actual Dropbox folder, confirmed the `.ledger` file and folder structure (`Photos`/`Documents`/`Backups`/`Exports`) on disk, read the Wayfarer row back out of the SQLite file directly, restarted the app and confirmed it reopens the remembered Vault automatically with no setup screen, and confirmed visually (screenshot) that the Home page shows "Welcome back, Jan."
- The Foundation milestone (v0.1.0) is now essentially complete.

- Built the Gear Library, the first real feature on top of the Foundation: `gear` and `photos` tables (migration 2), a generic-repository-based `gear` IPC API, and `GearListPage`/`GearDetailPage`/`GearForm` on the frontend. Gear can be created with just a name (Progressive Completion) or with category, Maker, material, weight, colour, and price.
- Built real photo import: `vault.importPhoto()` copies a chosen file into the Vault's `Photos` folder (named by content checksum, so re-importing the same photo doesn't duplicate it), and a custom `wl-vault://` protocol (registered in `main.cjs`, scoped to the open Vault's `Photos` folder only) lets the sandboxed renderer display those photos without direct filesystem access.
- Realised Gear needed Makers to be their own entity, not a text field, matching Chapter 2 of the Bible ("A Maker can be connected to many Gear items"). Added `makers` table + `gear.maker_id` (migration 3), a `makers` IPC API, and `MakerListPage`/`MakerDetailPage`/`MakerForm`. Added `MakerPicker` — a dropdown on the Gear form that can also create a new Maker inline without leaving the form.
- Extracted the "large photo cards" pattern (Chapter 4) into a shared `src/styles/photo-grid.css` so Gear and Makers (and later Festivals/Outfits) all get the same photo-first list view for free.
- Fixed a real navigation gap the Wayfarer found: the Gear and Makers list pages had no way back to Home at all. Made the header title a permanent Home link instead of patching each page individually.
- Verified everything for real: added an actual piece of gear with a real photo, confirmed the file landed in the Vault's `Photos` folder and the row in the `.ledger` file; created a Maker from the Gear form, gave it a website and logo, and confirmed the `gear.maker_id` relationship by reading it straight out of the database.

Next:
- Icons and further Forms polish are still open Design System items; build them when a feature needs them rather than speculatively.
- Gear History, Gear Maintenance, Tags, and Archive Gear (soft delete UI) remain open Gear backlog items.
- Decide the next feature — Outfits or Festivals are the next natural candidates per the Phase 2 roadmap, and Festivals would let Gear's "Journey" (seen at which festivals) start to take shape.

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