# Chapter 4 — Domain Model

**Status:** Stable  
**Version:** 1.0  
**Last Updated:** 2026-07-24

---

> *"A memory gains meaning through the things connected to it."*

---

## Purpose

This chapter defines the core domain model of The Wayfarer's Ledger.

The application is built around a small number of independent entities connected through meaningful relationships.

The domain model should remain stable over the lifetime of the project.

Features may change.

The model should rarely need to.

---

# Design Philosophy

Every object represents something real.

Objects should never exist simply because a database requires them.

Relationships should reflect reality rather than implementation.

---

# Core Principles

The domain follows four principles.

## Independent Entities

Every core object exists independently.

Examples:

- Gear exists without an Outfit.
- An Outfit exists without a Festival.
- A Festival exists without Journal Entries.

Relationships add meaning.

They do not create existence.

---

## Stable Identity

Every entity receives a permanent unique identifier.

Names may change.

Identifiers never do.

---

## Rich Relationships

Relationships are first-class citizens.

The value of the Ledger comes from connecting memories.

---

## Progressive Completion

Every entity should be useful immediately after creation.

Only a name should be required whenever practical.

Everything else can be added later.

---

# Core Entities

The following entities form the foundation of the Ledger.

## Wayfarer

Represents the owner of the Ledger.

Relationships:

- owns one Ledger

---

## Ledger

Represents one complete collection.

Contains:

- Gear
- Outfits
- Festivals
- Journal Entries
- Wishlist
- Timeline
- Makers

---

## Gear

Represents one physical item.

Examples:

- Boots
- Cloak
- Belt
- Helmet
- Drinking Horn

Relationships:

- belongs to one Ledger
- may belong to many Outfits
- may appear at many Festivals
- may have many Maintenance records
- may have many Photos
- has one Maker
- may contain many Experience Notes

---

## Outfit

Represents a reusable combination of Gear.

Relationships:

- belongs to one Ledger
- contains many Gear items
- may be worn at many Festivals
- may have many Photos
- may have many Versions

---

## Festival

Represents one real-world event.

Relationships:

- belongs to one Ledger
- may reference many Outfits
- may reference many Gear items
- may contain many Journal Entries
- may contain many Photos

---

## Journal Entry

Represents one written memory.

Relationships:

- belongs to one Festival (optional)
- may reference Gear
- may reference Outfits
- may reference Photos

---

## Experience Note

Represents practical knowledge gathered over time.

Relationships:

- belongs to one Gear item

---

## Maintenance

Represents work performed on Gear.

Relationships:

- belongs to one Gear item

---

## Maker

Represents the creator of Gear.

Relationships:

- creates many Gear items

---

## Photo

Represents one stored image.

A Photo may belong to multiple entities simultaneously.

Examples:

- Gear
- Outfit
- Festival
- Journal Entry

Photos are shared resources.

Never duplicated.

---

## Wishlist Item

Represents desired future Gear.

A Wishlist Item may later become a Gear item.

---

## Timeline Event

Represents one important moment.

Timeline Events are generated from meaningful actions.

Examples:

- First Festival
- New Gear
- Outfit Version
- Maintenance
- Journal Entry

Not every database update becomes a Timeline Event.

---

# Entity Relationships

Wayfarer

↓

Ledger

↓

Gear ←→ Outfit

↓

Festival

↓

Journal Entry

↓

Photo

Additional relationships:

Maker → Gear

Maintenance → Gear

Experience Note → Gear

Wishlist Item → Future Gear

Timeline Event → Entire Journey

---

# Ownership Rules

Everything belongs to exactly one Ledger.

Nothing exists outside a Ledger.

The Vault stores files.

The Ledger stores meaning.

---

# Identifier Rules

Every entity receives:

- UUID
- Created date
- Last modified date

Identifiers never change.

---

# Deletion Philosophy

Deleting memories should be difficult.

The application should prefer:

Archive

instead of

Delete

Whenever practical.

---

# Keeper's Notes

The domain model is intentionally small.

Future features should extend existing entities before introducing new ones.

A simple domain is easier to understand, maintain and preserve over time.