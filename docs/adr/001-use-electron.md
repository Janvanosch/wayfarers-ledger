# ADR-001 — Package the Ledger as an Installed Desktop Application (Electron)

**Status:** Accepted

**Date:** 2026-07-24

---

## Context

Chapter 7 of the Project Bible requires that each Wayfarer's data live in a single
`.ledger` file (SQLite) inside a Vault folder the Wayfarer controls — one they can
put in Dropbox, OneDrive, iCloud Drive, a NAS, or a plain local folder, with no
account and no cloud dependency of our own.

The project was being built as a Progressive Web App (a website, run in a
browser). Browsers deliberately restrict a website's ability to read and write
arbitrary files on disk, for security reasons. The only browser mechanism that
comes close — the File System Access API — only lets a page read/write a folder
after the Wayfarer grants permission in that specific browser session, is only
supported in Chromium-based browsers (Chrome, Edge), and is not available on
Firefox, Safari, or iOS at all.

This put the PWA approach in direct tension with the Bible's Vault promise: full
support would only exist for some Wayfarers (Chrome/Edge users), and the
"just a file on disk" simplicity the Bible describes would need a workaround
everywhere else.

---

## Options Considered

- **Stay a PWA, rely on the File System Access API.** Works well in Chrome/Edge.
  No real support in Firefox, Safari, or iOS. Would require a second, different
  storage mechanism as a fallback for those Wayfarers, adding complexity and
  fragmenting the experience the Bible describes as one, portable Ledger.

- **Stay a PWA, use the browser's built-in storage (IndexedDB) instead of a
  real file.** Works identically in every browser. But the data would live
  inside hidden browser storage rather than a visible `.ledger` file — it
  could not be opened, backed up, or dropped into a synced folder the way
  Chapter 7 describes, and browsers are free to clear this storage under
  disk-pressure conditions.

- **Package the app as an installed desktop application (Electron or
  Tauri).** An installed application has normal, unrestricted access to the
  filesystem, the same as any other program on the computer. It can use a
  real SQLite database file and save it directly into whichever folder (e.g.
  a Dropbox folder) the Wayfarer chooses, with no browser permission dance and
  no per-browser inconsistency. The cost is that the Wayfarer installs the
  application once, rather than opening a link.

  Within this option, two concrete tools were considered:
  - **Tauri** — produces a much smaller, lighter binary by reusing the
    operating system's built-in web view, but requires installing and
    maintaining a Rust toolchain.
  - **Electron** — the long-established, widely used approach (VS Code,
    Slack, Discord), requiring only the Node.js tooling already in use for
    this project. The resulting binary is larger, since it bundles its own
    Chromium runtime, but setup and long-term maintenance are simpler.

---

## Decision

Package The Wayfarer's Ledger as an installed desktop application using
**Electron**.

The existing React + TypeScript + Vite frontend is unaffected — it continues
to be the entire user interface. Electron's main process (`electron/main.cjs`)
opens a native window and loads that frontend: the Vite dev server during
development, the built `dist/index.html` in production.

Electron was chosen over Tauri specifically to avoid introducing a new
language/toolchain (Rust) into the project. The larger installed size is an
accepted trade-off for a personal, single-user application that does not need
to be distributed at scale.

The actual SQLite/repository implementation (how the `.ledger` file is read
and written, and how the React frontend talks to that code) is a separate,
follow-up decision — see the Core Infrastructure section of the current
milestone.

---

## Consequences

Positive:

- The `.ledger` file described in the Project Bible can be implemented as a
  literal file, written directly into whatever folder the Wayfarer chooses
  (Dropbox, OneDrive, a local folder, a NAS) — exactly as Chapter 7 describes,
  with no per-browser inconsistency.
- Full, unrestricted access to Node.js and native filesystem APIs from the
  application's main process, needed for SQLite and the Vault (Photos,
  Documents, Backups, Exports folders).
- One consistent experience across Windows/macOS/Linux, instead of
  browser-dependent behaviour.
- No new language/toolchain requirement — builds on the Node/npm tooling
  already used by the project.

Negative:

- The Wayfarer must install the application rather than just opening a link;
  updates need a distribution/update mechanism rather than "refresh the page."
- The packaged application is significantly larger than a plain website,
  because Electron bundles its own Chromium runtime.
- A future mobile companion app (mentioned as a Beyond v1.0 idea in the
  roadmap) will need its own, separate technical approach — Electron does not
  extend to mobile.
