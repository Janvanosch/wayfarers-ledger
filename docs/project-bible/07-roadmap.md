# Chapter 7 — Technical Architecture

**Status:** Stable  
**Version:** 1.0  
**Last Updated:** 2026-07-24

---

> *"Technology should support the Journey, never define it."*

---

## Purpose

This chapter describes the technical architecture of The Wayfarer's Ledger.

The architecture has been chosen to support three long-term goals:

- Longevity
- Privacy
- Simplicity

Every technical decision should reinforce these goals.

---

# Architecture Overview

The Wayfarer's Ledger is a desktop-first application built with modern web technologies.

The application is designed around a modular architecture that separates presentation, business logic and data.

The codebase should remain understandable and maintainable for many years.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite

---

## Routing

- React Router

---

## Styling

- CSS Modules or scoped component styles
- Global design tokens
- Responsive layouts

---

## Data Storage

Primary storage:

- SQLite

Supporting storage:

- Local file system
- Images
- Documents

The database stores structured information.

The Vault stores files.

---

## AI

AI is optional.

Potential providers may include:

- OpenAI
- Local LLMs
- Future providers

AI integrations must remain modular.

Replacing an AI provider should require minimal code changes.

---

# Folder Structure

The project follows a feature-oriented structure.

```
src/
│
├── app/
├── assets/
├── components/
├── features/
├── pages/
├── shared/
├── styles/
└── types/
```

Each folder has a single responsibility.

---

# Application Layers

The application consists of four primary layers.

## Presentation

Responsible for:

- Pages
- Components
- Layout
- Styling

No business logic belongs here.

---

## Features

Contains application behaviour.

Examples:

- Gear
- Outfits
- Festivals
- Journal
- Search

Each feature owns its own components, hooks and logic.

---

## Shared

Contains reusable code.

Examples:

- UI components
- utilities
- hooks
- services
- constants

---

## Data

Responsible for:

- persistence
- repositories
- database access
- imports
- exports

The UI should never communicate directly with the database.

---

# Routing Philosophy

Pages represent destinations.

Components represent reusable interface elements.

Features represent business capabilities.

The route structure should remain shallow and predictable.

---

# State Management

Prefer local state whenever practical.

Introduce global state only when multiple parts of the application genuinely require shared data.

Avoid unnecessary complexity.

---

# Dependency Philosophy

Before adding a dependency, ask:

- Does it save significant development time?
- Does it simplify maintenance?
- Will it still be valuable in five years?

If not, prefer native solutions.

---

# Error Handling

Errors should be:

- understandable
- recoverable
- actionable

The Wayfarer should never lose data because of an application error.

---

# Performance Strategy

Optimise for perceived responsiveness.

Priorities:

- fast startup
- instant navigation
- smooth scrolling
- responsive search

Avoid premature optimisation.

Measure before optimising.

---

# Security

The Ledger is a local-first application.

Security priorities include:

- protecting local data
- validating imports
- safe file handling
- secure AI communication

The application should never expose private information without explicit permission.

---

# Testing Philosophy

Testing should focus on confidence.

Priorities:

- business logic
- data integrity
- critical workflows

Visual details may evolve.

Core functionality must remain reliable.

---

# Future Growth

The architecture should support future additions without major restructuring.

Examples:

- mobile companion
- cloud synchronisation
- plugins
- additional AI providers

New capabilities should extend the architecture rather than replace it.

---

# Keeper's Notes

Architecture exists to support the Journey.

If the architecture becomes more important than the memories it protects, it has failed.