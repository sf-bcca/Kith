# Specification: Code Review Remediation & Architectural Hardening

## Overview
This track aims to resolve several critical bugs and architectural weaknesses identified during the recent code review. The focus is on ensuring data integrity for complex relationships, improving API consistency, and removing fragile timing-based workarounds in favor of strict transactional consistency.

## Functional Requirements

### 1. Enhanced Sibling Relationship Persistence
- **Data Model Update:** Modify the `siblings` column in the `family_members` table and the `FamilyMember` TypeScript interface to store an array of objects: `{ id: string, type: SiblingType }`.
- **Relationship Wizard Integration:** Ensure that `AddMemberModal` and `MemberBiography` correctly process both existing siblings and new placeholders, persisting the relationship type (Full, Half, Step, Adopted) to the database.
- **Reciprocal Sync:** Maintain bidirectional consistency for these enhanced objects during creation and updates.

### 2. Lifespan Data Integrity
- **Fix Update Bug:** Update the `PUT /api/members/:id` endpoint to allow unsetting `death_date` and `death_place`. Replace the restrictive `COALESCE` logic with conditional updates that distinguish between "not provided" and "provided as null".
- **Shared Validation:** Extract birth/death date validation logic into a shared utility function used by both `AddMemberModal` and `MemberBiography`.

### 3. API & State Consistency
- **Transactional Backend:** Remove all `setTimeout` retry loops from the frontend (`FamilyTreeView`) and backend (`server/index.ts`).
- **Reciprocal Operations:** Ensure all reciprocal relationship links (parents, children, spouses, siblings) are handled within the same database transaction as the primary operation.
- **Endpoint Unification:** Align the visibility and authorization logic between `GET /api/members/:id` and `GET /api/members` to prevent inconsistent fallback behavior in `FamilyService`.

## Visual & UX Improvements
- **Tree Connection Logic:** Update the SVG rendering in `FamilyTreeView` to include a horizontal bracket for multiple siblings, ensuring they are visually connected to their parents and each other correctly.

## Acceptance Criteria
- [ ] Sibling types (Step, Adopted) are correctly saved and retrieved.
- [ ] New sibling placeholders created in the wizard are successfully persisted as new members and linked.
- [ ] Users can successfully clear a previously set death date.
- [ ] All `setTimeout` workarounds are removed, and the UI remains consistent after updates.
- [ ] Sibling connecting lines in the tree view correctly span multiple siblings.
- [ ] Automated tests verify the transactional integrity of reciprocal links.

## Out of Scope
- Implementing a full undo/redo system for tree edits.
- Adding support for non-binary relationship types beyond the current set.
