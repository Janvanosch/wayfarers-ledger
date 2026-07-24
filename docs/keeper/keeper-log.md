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

- Jan asked whether "Journey" was ever meant to replace "Festival" as a term. Checked the actual `docs/project-bible/` files (which had evolved further than the text originally pasted into this chat) and confirmed: Festival is unchanged as a concept, but Chapter 3's navigation groups it under a top-level "Journey" section alongside Timeline, Journal Entries, Memories, and Photos — the way "Gear" is the umbrella for Gear items, Makers, and Maintenance. Decided, with Jan, to build a real `/journey` hub page now rather than a flat "Festivals" button, so Timeline and Journal Entries can slot into the same page later without restructuring navigation again.
- Built Festivals: `festivals` table + `gear_festivals` many-to-many join table (migration 4), a `festivals` IPC API, and `JourneyPage`/`FestivalDetailPage`/`FestivalForm` (name, dates, location, weather, notes, banner photo).
- Closed the loop between Gear and Festivals rather than leaving them as parallel, disconnected features: added a "Seen at" section to the Gear detail page (`FestivalTagPicker`) so a piece of Gear can be tagged with the Festivals it's been to, with quick "add a new Festival" inline, matching the same pattern as `MakerPicker`.
- Renamed the Home quick action from "Festivals" to "Journey" to match the real navigation term, and pointed it at `/journey`.
- Verified end to end: created a real Festival, confirmed its row in the `.ledger` file including the banner photo; linked it to the "Beige Pants" Gear item and confirmed the `gear_festivals` join row directly in the database.

- Renamed Gear categories per Jan: Equipment → Weaponry, Camping → Utilitarian, Maintenance → Maintenance & Storage. No existing Gear used the old names, so no data migration was needed.
- Jan asked whether it's possible for the Ledger to also be a mobile app, since the real point of the app is capturing memories *while walking around a festival* — a genuinely mobile use case, not an afterthought. Talked through it honestly: the visual/React layer would carry over reasonably via a tool called Capacitor, but the storage engine (`electron/lib/*.cjs` — sql.js, direct Vault folder access) is desktop-only and doesn't run on a phone; phones don't allow raw folder access the way desktop OSes do, so a mobile version would need a different, likely cloud-sync-based storage approach. Agreed with Jan: keep building out core features on desktop now (this is not wasted work — every page only ever talks to `window.ledger.*`, never to Electron directly, so the screens themselves should carry over largely as-is), and treat "make it work on a phone in a field" as the very next major phase once the core feature set is further along, rather than a distant "someday" item.
- Built Outfits, including real version history — matching Chapter 5 precisely: an Outfit (name, cover photo) is a stable identity; each Version is an immutable snapshot (`outfit_versions`, migration 5) of which Gear it references plus notes. `outfits.current_version` tracks the latest; versions are append-only, never edited or deleted, matching "Versions never change. A new version creates a new record." "+ New Version" pre-fills the Gear picker from the previous version so adjusting a look is fast (`OutfitVersionForm`), and the Outfit detail page shows a browsable Version History of everything before the current one.
- Verified end to end: created "Veteran Knight" with a real banner photo, added Version 1 with the "Beige Pants" Gear item and a note, confirmed both the `outfits` and `outfit_versions` rows directly in the `.ledger` file, and confirmed visually.
- Jan's next idea, noted for later rather than built now: instead of only a flat "Gear was Seen at Festival X" link, tag *specific Gear or whole Outfits within individual Festival photos* — richer than the current relationship, since a photo could show which exact pieces were worn in that moment. Added to the Photos section of the backlog. Would need a photo-level annotation UI (a good fit once the "Photo Library"/"Photo Viewer" backlog items are picked up) rather than the current gallery-less Festival photo handling (Festivals only have a single banner cover today, no gallery).

- Jan asked how Journal Entries and Timeline relate, and proposed renaming Festival to "Journeys." Checked `docs/project-bible/04-domain-model.md` directly rather than answer from memory: it turns out what Jan described (a festival-scoped container for notes, photos, and tagged Gear/Outfits) is already the exact design of Festival + Journal Entry + Photo tagging — Journal Entry "belongs to one Festival (optional), may reference Gear, may reference Outfits, may reference Photos." Recommended keeping "Festival" as-is rather than renaming (it already means the right thing, and "Journey" is reserved for the singular, never-ending lifetime concept — overloading it would conflict), and building Journal Entries as the actual missing piece. Jan agreed.
- Built Journal Entries matching that domain model precisely: `journal_entries` table (title optional, body required, festival_id optional) plus three many-to-many join tables — `journal_entry_photos`, `journal_entry_gear`, `journal_entry_outfits` (migration 6). A single Journal Entry can now hold multiple photos and tag specific Gear and Outfit items, not just be attached to a Festival.
- Generalised the join-table pattern rather than writing a fourth near-identical block of manual SQL: added `createJoinTable(table, leftColumn, rightColumn)` to `electron/lib/repository.cjs` (link/unlink/rightIdsFor/leftIdsFor), and refactored the existing `gearFestivals` onto it too. Verified the refactor didn't break the existing "Seen at" feature before moving on.
- Added `Textarea` (Journal Entry's body needs "a large writing area," which the single-line `Input` couldn't give it) and three new shared components for tagging: `GearMultiPicker` (extracted from `OutfitVersionForm`, which used it first), `OutfitMultiPicker`, and `MultiPhotoPicker` (add/remove multiple photos before saving).
- Journal Entries are reachable two ways: from the Journey hub (optionally tagged to any Festival via a dropdown) and from a Festival's own detail page as its "Memories" section (pre-locked to that Festival, no picker needed).
- Verified end to end: wrote a real entry ("Zin in Castlefest!") with a photo, tied to Castlefest 2026, confirmed the `journal_entries` and `journal_entry_photos` rows directly in the `.ledger` file, and confirmed the `gear_festivals` refactor left the existing Beige Pants ↔ Castlefest 2026 link untouched.

- Built Timeline: a `timeline_events` table (migration 7), auto-generated (never manually created) from real actions — new Gear, new Festival, new Outfit plus every Version, new Journal Entry, and the Wayfarer's own "Journey Started." The first of each kind gets a special title ("First Gear: ...", "First Festival: ...") per Chapter 3's "Celebrate Milestones, Not Progress"; later ones get a plain descriptive title ("New Gear: ...", matching "Outfit Version 3" style examples from Chapter 2).
- Realised existing Vaults (Jan's included) already had real history — Beige Pants, Castlefest 2026, Veteran Knight, the journal entry — created before Timeline existed. Rather than let Timeline start out empty for them (which would look broken, not like a new feature), wrote a backfill directly into migration 7 that reconstructs Timeline Events from each table's existing rows, using their real `created_at` timestamps so the order is accurate.
- Wired Timeline into two places: the full history at the top of the Journey hub, and the 5 most recent events on Home's "Recent Journey" (previously a static "no journeys yet" placeholder — now genuinely shows real activity).
- Verified end to end: confirmed the 6 backfilled events matched Jan's actual usage history in the correct chronological order by reading them directly from the `.ledger` file, then confirmed visually on both the Journey page and Home.

Next:
- Icons and further Forms polish are still open Design System items; build them when a feature needs them rather than speculatively.
- Gear History, Gear Maintenance, Tags, and Archive Gear (soft delete UI) remain open Gear backlog items.
- Experience Notes (per-Gear practical notes like "needed thicker socks") are a distinct, smaller concept from Journal Entries and still open.
- The Journey hub (Timeline, Festivals, Journal Entries/Memories) is now functionally complete. The global Capture (+) button (Chapter 4: "the fastest action in the application") is the last open Core Journey item, and a good candidate before or alongside starting the mobile phase.
- Mobile phase: investigate Capacitor for wrapping the existing React frontend, and design a cloud-sync-based storage approach to replace direct Vault folder access (Dropbox/Google Drive APIs are the likely candidates) once desktop features are further along.
- Mobile phase: investigate Capacitor for wrapping the existing React frontend, and design a cloud-sync-based storage approach to replace direct Vault folder access (Dropbox/Google Drive APIs are the likely candidates) once desktop features are further along.

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