# Implementation Plan: Sibling Relationships

This plan outlines the steps to implement sibling relationship support using a hybrid data model, a management wizard, and visualization updates.

## Phase 1: Data Model & Database Schema
Update the core data structures to support explicit and implicit sibling links.

- [ ] Task: Update `FamilyMember` TypeScript type
    - [ ] Add `siblings` array to `FamilyMember` interface in `types/family.ts`.
- [ ] Task: Create Database Migration for Sibling Links
    - [ ] Create `008_add_siblings_column.sql` to add a `siblings` JSONB column to `family_members`.
    - [ ] Update `server/SCHEMA.md` to reflect the new column.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Data Model & Database Schema' (Protocol in workflow.md)

## Phase 2: Backend Logic & API Updates
Enhance the backend to handle sibling relationship CRUD operations and calculations.

- [ ] Task: Update `FamilyService` (Backend) logic
    - [ ] Write tests for sibling derivation logic (implied by parents).
    - [ ] Implement `getSiblings` utility to return both implied and manual siblings.
- [ ] Task: Update Member Creation/Update Controllers
    - [ ] Write tests for sibling assignment in API endpoints.
    - [ ] Update `settingsController.ts` (or relevant member controller) to process `siblings` field in requests.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Backend Logic & API Updates' (Protocol in workflow.md)

## Phase 3: Frontend Service & Context
Update the frontend data layer to support the new sibling fields.

- [ ] Task: Update `FamilyService.ts` (Frontend)
    - [ ] Write tests for fetching and updating sibling data.
    - [ ] Update API calls to include the `siblings` field.
- [ ] Task: Update `FamilyContext.tsx`
    - [ ] Write tests for state management of sibling relationships.
    - [ ] Ensure sibling data is properly cached and accessible globally.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Service & Context' (Protocol in workflow.md)

## Phase 4: Relationship Wizard (UI)
Implement the UI for managing siblings during member creation and editing.

- [ ] Task: Create `RelationshipWizard` component
    - [ ] Write tests for the wizard's UI states and input handling.
    - [ ] Implement the wizard with options for Biological, Step, and Adopted relations.
- [ ] Task: Integrate Wizard into `AddMemberModal.tsx`
    - [ ] Update `AddMemberModal.tsx` to include the wizard as a step.
    - [ ] Write integration tests for the full member creation flow with siblings.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Relationship Wizard (UI)' (Protocol in workflow.md)

## Phase 5: Tree Visualization Updates
Update the tree rendering logic to display siblings side-by-side.

- [ ] Task: Update `TreeService.ts` for Sibling Layout
    - [ ] Write tests for sibling positioning logic in tree traversal.
    - [ ] Update layout algorithm to group siblings side-by-side under shared parents.
- [ ] Task: Update `FamilyTreeView.tsx` and `HorizontalTree.tsx`
    - [ ] Implement rendering of branch lines for siblings.
    - [ ] Add visual indicators for different sibling types (Biological vs. Manual/Step).
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Tree Visualization Updates' (Protocol in workflow.md)
