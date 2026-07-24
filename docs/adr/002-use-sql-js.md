# ADR-002 — Use sql.js for the Ledger Database

**Status:** Accepted

**Date:** 2026-07-24

---

## Context

ADR-001 established that The Wayfarer's Ledger runs as an installed Electron
application specifically so it can read and write a real SQLite `.ledger`
file, as required by Chapter 7 of the Project Bible.

Electron's main process has full Node.js access, so the obvious choice was
`better-sqlite3` — a widely used, synchronous, native SQLite binding. It was
installed first.

Installing it failed. `better-sqlite3` is a native addon: it needs to be
compiled for the exact combination of platform and Node/Electron version in
use. No pre-built binary was available for this combination, so `npm install`
fell back to compiling it from source via `node-gyp`, which in turn requires
Python and a full C++ compiler toolchain (on Windows: Visual Studio Build
Tools). Neither was present on this machine, and installing them is a heavy,
multi-gigabyte, admin-level system change — precisely the kind of toolchain
burden ADR-001 chose Electron over Tauri to avoid (there, it would have been
a Rust toolchain instead).

---

## Options Considered

- **Install Python + Visual Studio Build Tools and use `better-sqlite3`
  anyway.** Would work, and gives the most conventional, best-performing
  option. Rejected for now: a large, invasive system install, working against
  the reasoning in ADR-001, and something to reinstall on every future
  machine/contributor this project touches.

- **`node:sqlite`, Node's newer built-in SQLite module.** Would avoid a
  dependency entirely, but its availability depends on exactly which Node.js
  version is embedded inside this specific Electron release, which was not
  worth gambling on without adding a fallback path anyway.

- **`sql.js`.** A WebAssembly build of SQLite. Pure JavaScript/WASM — no
  native compilation, no compiler toolchain, works identically on every
  platform. The trade-off: it operates on the database as a block of bytes
  in memory rather than a normal on-disk connection, so the app is
  responsible for loading that byte block on open and writing it back out to
  the `.ledger` file after changes (handled once, centrally, in
  `electron/lib/database.cjs`).

---

## Decision

Use **sql.js** for the `.ledger` database, wrapped in
`electron/lib/database.cjs`. It opens the `.ledger` file into memory on
launch, and saves the in-memory database back to that file after every write
(`electron/lib/repository.cjs` calls `database.save()` after every create,
update, and soft-delete).

---

## Consequences

Positive:

- No native compiler toolchain required, on this machine or any future one —
  `npm install` alone is enough.
- Identical behaviour across Windows/macOS/Linux, since nothing is
  platform-compiled.
- The `.ledger` file remains a plain, standard SQLite file — openable with
  any ordinary SQLite tool, exactly as Chapter 7 intends.

Negative:

- The full database is held in memory and rewritten to disk on every save,
  rather than being modified in place on disk. For a personal Ledger's realistic
  size (thousands of records, not millions) this is not a practical
  performance concern, but it is a ceiling worth remembering if the Ledger
  ever needs to hold a very large number of Photos rows or similar.
- If this ever becomes a real limitation, the migration path is to revisit
  `better-sqlite3` (or an async alternative) once a prebuilt binary is
  available for the Node/Electron combination in use, or once the toolchain
  cost is acceptable. `electron/lib/database.cjs` and `repository.cjs` are
  the only two files that would need to change — the rest of the app talks
  to the repository layer, not to sql.js directly.
