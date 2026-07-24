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

### Fixed
- App rendered a blank page because `<Routes>` was used outside a `<BrowserRouter>`
- Header and Footer used hardcoded colours and spacing instead of design tokens
- Heading and body fonts silently fell back to system fonts because the fonts were never loaded

### Removed
- Vite starter CSS
- Vite demo assets