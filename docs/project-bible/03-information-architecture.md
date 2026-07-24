# Chapter 3 — Information Architecture

**Status:** Stable  
**Version:** 1.0  
**Last Updated:** 2026-07-24

---

> *"Everything has its place. Every memory has its home."*

---

## Purpose

This chapter defines how information is organised inside The Wayfarer's Ledger.

The goal is to make information feel natural to find without requiring the Wayfarer to think about database structures or technical relationships.

The structure should mirror how people remember experiences rather than how computers store data.

---

# Design Philosophy

The Ledger is organised around memories.

Objects exist independently, but become meaningful through the relationships between them.

Examples:

- Gear belongs to the Wayfarer.
- Gear can appear in many Outfits.
- Outfits can be worn at many Festivals.
- Festivals contain Journal Entries.
- Journal Entries reference Gear.
- Photos connect everything together.

Nothing exists in isolation.

---

# Top-Level Sections

The application is organised into the following primary areas.

## Home

The starting point of every Journey.

Provides:

- Welcome message
- Recent Journey activity
- Quick Capture actions
- Upcoming reminders
- Recently edited items

---

## Journey

The chronological history of the Wayfarer.

Contains:

- Timeline
- Festivals
- Journal Entries
- Memories
- Photos

Purpose:

Remember experiences.

---

## Gear

The complete archive of physical equipment.

Contains:

- Gear items
- Categories
- Makers
- Maintenance
- Materials
- Photos

Purpose:

Remember possessions.

---

## Outfits

Collections of Gear assembled for a specific appearance or purpose.

Contains:

- Outfit versions
- Photos
- Notes
- Favourite outfits

Purpose:

Remember combinations.

---

## Wishlist

Ideas for future Gear.

Contains:

- Desired items
- Inspiration
- Favourite Makers
- Notes

Purpose:

Remember possibilities.

---

## Vault

The physical storage location for the Ledger.

Contains:

- Photos
- Documents
- Backups
- Imports
- Exports

Purpose:

Remember ownership.

---

## Settings

Application preferences.

Contains:

- Appearance
- AI
- Storage
- Backup
- Import & Export
- About

Purpose:

Configure the Ledger.

---

# Relationship Model

The application is intentionally relationship-driven.

Example:

Festival

↓

Outfit

↓

Gear

↓

Maker

↓

Maintenance

↓

Journal Entries

↓

Photos

Every object should naturally lead to related memories.

---

# Navigation Principles

Navigation should always answer three questions.

## Where am I?

Every page should clearly communicate its current location.

---

## Where can I go?

Navigation should expose only meaningful destinations.

Avoid overwhelming the Wayfarer with options.

---

## Where have I been?

The Timeline, breadcrumbs and recent activity help maintain orientation.

---

# Search

Search should feel like remembering.

A search for "Castlefest" should find:

- Festivals
- Journal Entries
- Photos
- Outfits
- Gear worn there
- Experience Notes

The Wayfarer should rarely need to know where something was stored.

---

# Progressive Disclosure

Complexity should reveal itself gradually.

Most screens should expose only the information required at that moment.

Advanced information remains available without overwhelming new users.

---

# Cross-Linking

Everything should be connected.

Examples:

A Gear page links to:

- Outfits
- Festivals
- Maintenance
- Photos
- Journal Entries

A Festival links to:

- Outfits
- Gear
- Memories
- Photos
- Timeline events

Relationships create memories.

---

# Capture Flow

Creating something should always be faster than organising it.

Typical flow:

Capture

↓

Save

↓

Continue Journey

↓

Complete later

Perfection is never required.

---

# Keeper's Notes

The Ledger is organised around relationships instead of folders.

Every object should become more valuable as additional memories are connected to it.