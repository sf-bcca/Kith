# Implementation Plan: Sibling Relationships

This plan outlines the steps to implement sibling relationship support using a hybrid data model, a management wizard, and visualization updates.

## Phase 1: Data Model & Database Schema [checkpoint: 3a50497]
Update the core data structures to support explicit and implicit sibling links.

- [x] Task: Update `FamilyMember` TypeScript type [5e0829d]
    - [x] Add `siblings` array to `FamilyMember` interface in `types/family.ts`. [5e0829d]
- [x] Task: Create Database Migration for Sibling Links [5e0829d]
    - [x] Create `008_add_siblings_column.sql` to add a `siblings` JSONB column to `family_members`. [5e0829d]
    - [x] Update `server/SCHEMA.md` to reflect the new column. [5e0829d]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Model & Database Schema' (Protocol in workflow.md) [3a50497]

## Phase 2: Backend Logic & API Updates [checkpoint: 696a2b2]
Enhance the backend to handle sibling relationship CRUD operations and calculations.

- [x] Task: Update Backend Logic [e2b2a8a]
    - [x] Add `siblings` column to `MEMBER_COLUMNS` constant [e2b2a8a]
    - [x] Update `POST /api/members` to handle `siblings` field [e2b2a8a]
    - [x] Update `PUT /api/members/:id` to handle `siblings` field [e2b2a8a]
    - [x] Implement `GET /api/members/:id/siblings` endpoint with implied sibling derivation [e2b2a8a]
- [x] Task: Update Member Creation/Update Controllers [e2b2a8a]
    - [x] Update `server/index.ts` to process `siblings` field in requests [e2b2a8a]
    - [x] Added bidirectional sibling link synchronization [e2b2a8a]
- [x] Task: Conductor - User Manual Verification 'Phase 2: Backend Logic & API Updates' (Protocol in workflow.md) [e2b2a8a]

## Phase 3: Frontend Service & Context
Update the frontend data layer to support the new sibling fields.

- [x] Task: Update `FamilyService.ts` (Frontend)
    - [x] Added `getSiblings`, `addSibling`, `removeSibling` methods
    - [x] Updated API calls to include the `siblings` field
- [x] Task: Update `FamilyContext.tsx`
    - [x] Added sibling state (`siblings`, `isLoadingSiblings`)
    - [x] Added sibling methods (`loadSiblings`, `addSibling`, `removeSibling`, `clearSiblings`)
    - [x] Wrote integration tests for sibling state management
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Service & Context' (Protocol in workflow.md)

## Phase 4: Relationship Wizard (UI)
Implement the UI for managing siblings during member creation and editing.

- [x] Task: Create `RelationshipWizard` component
    - [x] Implemented wizard with options for Biological, Step, and Adopted relations
    - [x] Added search functionality for existing family members
    - [x] Added placeholder creation for new siblings
- [x] Task: Integrate Wizard into `AddMemberModal.tsx`
    - [x] Added "Add Siblings" button to member creation form
    - [x] Updated form submission to include sibling IDs
    - [x] Wrote integration tests for the wizard's UI states and input handling
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Relationship Wizard (UI)' (Protocol in workflow.md)

## Phase 5: Tree Visualization Updates
Update the tree rendering logic to display siblings side-by-side.

- [x] Task: Update `TreeService.ts` for Sibling Layout
    - [x] Added `siblings` field to `TreeData` interface
    - [x] Implemented `getSiblingType` utility to identify full vs half siblings
    - [x] Implemented `groupSiblingsByParents` for grouping siblings
    - [x] Updated `getTreeFor` to fetch siblings alongside other relations
    - [x] Wrote tests for sibling positioning logic
- [x] Task: Update `FamilyTreeView.tsx` and `HorizontalTree.tsx`
    - [x] Extended `MemberNode` with `isSibling` and `siblingType` props
    - [x] Added visual indicators for sibling types (colored badges)
    - [x] Implemented sibling rendering in tree between parents and focus
    - [x] Added connecting lines for sibling relationships
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Tree Visualization Updates' (Protocol in workflow.md)
