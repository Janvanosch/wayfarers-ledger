# Documentation

Welcome to the documentation for **The Wayfarer's Ledger**.

This documentation is the single source of truth for the project.

Every major design decision, architectural choice and development milestone should be documented here.

---

# Documentation Structure

```
docs/
│
├── adr/
│   └── README.md
│
├── development/
│   ├── backlog.md
│   ├── changelog.md
│   ├── current-milestone.md
│   └── roadmap.md
│
├── keeper/
│   └── keeper-log.md
│
└── project-bible/
    ├── 01-vision.md
    ├── 02-terminology.md
    ├── 03-information-architecture.md
    ├── 04-domain-model.md
    ├── 05-user-experience.md
    ├── 06-technical-principles.md
    └── 07-technical-architecture.md
```

---

# Project Bible

The Project Bible defines the permanent philosophy of the project.

It should change rarely.

It answers questions such as:

- Why does this project exist?
- What are we building?
- How should it feel?
- What technical principles guide development?

Every development decision should align with the Project Bible.

---

# Development

The Development documents describe the current state of the project.

Unlike the Project Bible, these documents change frequently.

They answer questions such as:

- What are we building right now?
- What has already been completed?
- What still needs to be done?
- What is planned next?

---

# Keeper

The Keeper Log acts as the project's memory between development sessions.

It contains:

- current project status
- recent architectural decisions
- active milestone
- known issues
- next recommended task

A new development session should always begin by reviewing the Keeper Log.

---

# ADR

Architectural Decision Records document important technical decisions.

Each ADR explains:

- the problem
- the available options
- the chosen solution
- the reasoning behind that decision

ADRs should only be created for decisions that are expected to have long-term impact.

---

# Documentation Philosophy

Documentation should answer **why**, not simply **what**.

Code explains implementation.

Documentation explains intent.

Both are required for a maintainable project.