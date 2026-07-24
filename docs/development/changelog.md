# Changelog

All notable changes to The Wayfarer's Ledger are documented here.

The format is intentionally concise.

---

# Unreleased

## Added

- Initial repository structure
- Project documentation structure
- Project Bible v1.0
- Development documentation
- Feature-first project architecture
- React + TypeScript + Vite foundation
- React Router integration

---

# Version 0.1.0

_Not yet released._

---

# Changelog Guidelines

Each release should contain only the most important changes.

Organise entries using the following sections where applicable:

## Added

New features.

## Changed

Changes to existing behaviour.

## Fixed

Bug fixes.

## Removed

Features that have been removed.

## Deprecated

Features scheduled for future removal.

## Security

Security-related improvements.

---

# Notes

The changelog is intended for humans.

Keep entries brief, clear and focused on meaningful changes.

## 2026-07-24

### Added
- Global styling architecture
- Design token system
- UI component folder structure
- Reusable UI components: Text, Stack, Surface, Card, Button
- Home page now composed entirely from design system components

- Self-hosted `Inter` and `Cormorant Garamond` variable fonts (no external CDN dependency)
- Electron application shell (ADR-001) so the app runs as an installed desktop program with real filesystem access, instead of a browser-only PWA
- Real SQLite-backed Ledger storage using sql.js (ADR-002): the Vault folder, `.ledger` file, and Wayfarer identity are now created and remembered for real
- First-run onboarding (`VaultSetup`) to create or open a Vault and name the Wayfarer
- Generic repository pattern (`electron/lib/repository.cjs`) for future entities (Gear, Festivals, ...) to build on
- `Input` component
- Gear Library: add/view/edit Gear with a real photo (imported into the Vault), category, Maker, material, weight, colour, and price
- A custom `wl-vault://` protocol so the renderer can securely display photos stored in the Vault
- Maker Library: Makers are their own entity (name, website, Instagram, notes, logo) linked to Gear, instead of free text — includes quick "add a new Maker" directly from the Gear form
- `Cover`, `MakerPicker` components, and a shared `photo-grid`/`photo-card` pattern for photo-first list views (reused by Gear and Makers, and future Festivals/Outfits)
- Clicking the app title in the header now always returns Home, fixing pages (Gear, Makers) that had no other way back
- Journey hub page (`/journey`) with a working Festivals section: add/view/edit a Festival with dates, location, weather, notes, and a banner photo
- Gear items can now be linked to the Festivals they were "Seen at" (a many-to-many relationship), editable from the Gear detail page, with quick "add a new Festival" inline
- Renamed Gear categories: Equipment → Weaponry, Camping → Utilitarian, Maintenance → Maintenance & Storage
- Outfits, with real version history: an Outfit is a name + cover photo; each Version is an immutable snapshot of which Gear it references plus notes. "+ New Version" pre-fills from the previous version so adjusting a look is fast, and old versions are preserved and browsable, never overwritten

### Fixed
- App rendered a blank page because `<Routes>` was used outside a `<BrowserRouter>`
- Header and Footer used hardcoded colours and spacing instead of design tokens
- Heading and body fonts silently fell back to system fonts because the fonts were never loaded

### Removed
- Vite starter CSS
- Vite demo assets