---
name: kith-tree-architect
description: Expert guidance for genealogy-specific data structures, recursive tree traversal, and complex family visualization layouts (Fan Charts, Pedigrees). Use when modifying TreeService, implementing new chart types, or handling complex relationship logic (blended families, adoptions).
---

# Kith Tree Architect

This skill provides the specialized logic required to manage and visualize complex genealogical data structures.

## Core Workflows

### 1. Tree Traversal & Data Fetching
When modifying `TreeService.ts`:
- **Ancestry**: Use recursive patterns for N-generation lookups. See [genealogy-patterns.md](references/genealogy-patterns.md) for recursion safety.
- **Descendants**: Use Breadth-First Search (BFS) for generational rendering.
- **Relational Integrity**: Ensure `parents`, `spouses`, and `children` arrays are mutually consistent during updates.

### 2. Visualization Layouts
- **Pedigree Chart**: 2^n layout (binary tree). Focus on vertical alignment of generations.
- **Fan Chart**: Polar coordinate systems. See [genealogy-patterns.md](references/genealogy-patterns.md) for geometry formulas.
- **Family Tree**: Hybrid graph layout. Handles multiple spouses and blended family units.

## Guidelines
- **Performance**: Use batch fetching (Promise.all) when retrieving multiple family members.
- **Types**: Adhere strictly to the `FamilyMember` type in `types/family.ts`.
- **Edge Cases**: Always consider members with missing parent data or multiple spouses.