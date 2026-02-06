# Implementation Plan: Code Review Remediation & Architectural Hardening

## Phase 1: Data Model & Backend Infrastructure [checkpoint: aa8adf7]
Ensure the foundation for complex relationships and transactional integrity is in place.

- [x] Task: Database Migration for Enhanced Sibling JSON 3230fbf
    - [ ] Write migration to update `siblings` column to store `{id, type}` objects
    - [ ] Update `server/SCHEMA.md` using `kith-schema-maintainer`
- [x] Task: Update Backend Types and Reciprocal Logic 6736878
    - [ ] Update `FamilyMember` type in `server/` to match enhanced JSON
    - [ ] Refactor reciprocal link logic in `POST /api/members` and `PUT /api/members/:id` to be transactional
    - [ ] Implement conditional updates in `PUT` to allow unsetting death details (Fix `COALESCE` bug)
- [x] Task: Unify Endpoint Logic and Remove Backend Retries 2e5058b
    - [ ] Remove `setTimeout` retry logic from `GET /api/members/:id`
    - [ ] Align visibility/auth logic between single and list member endpoints
- [x] Task: Conductor - User Manual Verification 'Data Model & Backend Infrastructure' (Protocol in workflow.md) aa8adf7

## Phase 2: Shared Logic & Validation (TDD) [checkpoint: 6ecfaeb]
Extract common logic to ensure consistency across the application.

- [x] Task: Implement Shared Lifespan Validation 2172227
    - [x] Write unit tests for `validateLifespan` utility in `src/utils/dateUtils.test.ts`
    - [x] Implement `validateLifespan` in `src/utils/dateUtils.ts`
- [x] Task: Conductor - User Manual Verification 'Shared Logic & Validation' (Protocol in workflow.md) 6ecfaeb

## Phase 3: Frontend Persistence & Relationship Wizard (TDD)
Update the UI to correctly handle enhanced data structures and placeholder persistence.

- [x] Task: Update Frontend Service Layer 38dfb11
    - [x] Write failing tests for `FamilyService` enhanced sibling mapping
    - [x] Update `FamilyService.ts` to handle `{id, type}` sibling mapping
- [x] Task: Fix Sibling Placeholder Persistence in Modals 0cec493
    - [x] Write failing tests for `AddMemberModal` sibling placeholder creation
    - [x] Update `handleSiblingUpdate` in `AddMemberModal.tsx` to persist new placeholders
    - [x] Update `MemberBiography.tsx` to use the shared validation and enhanced persistence
- [x] Task: Remove Frontend Timing Workarounds 8b05ddc
    - [x] Remove `setTimeout` retry logic from `FamilyTreeView.tsx`
- [~] Task: Conductor - User Manual Verification 'Frontend Persistence & Relationship Wizard' (Protocol in workflow.md)

## Phase 4: Visualization & UX (TDD)
Correct the visual representation of complex families.

- [ ] Task: Fix Sibling Connecting Lines
    - [ ] Write failing tests for sibling bracket positioning in `FamilyTreeView.test.tsx`
    - [ ] Update SVG logic in `FamilyTreeView.tsx` to render horizontal brackets for multiple siblings
- [ ] Task: Display Custom Sibling Types
    - [ ] Update `TreeService.getSiblingType` to prioritize persisted types over derived types
- [ ] Task: Conductor - User Manual Verification 'Visualization & UX' (Protocol in workflow.md)
