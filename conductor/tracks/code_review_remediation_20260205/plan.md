# Implementation Plan: Code Review Remediation & Architectural Hardening

## Phase 1: Data Model & Backend Infrastructure
Ensure the foundation for complex relationships and transactional integrity is in place.

- [x] Task: Database Migration for Enhanced Sibling JSON 3230fbf
    - [ ] Write migration to update `siblings` column to store `{id, type}` objects
    - [ ] Update `server/SCHEMA.md` using `kith-schema-maintainer`
- [~] Task: Update Backend Types and Reciprocal Logic
    - [ ] Update `FamilyMember` type in `server/` to match enhanced JSON
    - [ ] Refactor reciprocal link logic in `POST /api/members` and `PUT /api/members/:id` to be transactional
    - [ ] Implement conditional updates in `PUT` to allow unsetting death details (Fix `COALESCE` bug)
- [ ] Task: Unify Endpoint Logic and Remove Backend Retries
    - [ ] Remove `setTimeout` retry logic from `GET /api/members/:id`
    - [ ] Align visibility/auth logic between single and list member endpoints
- [ ] Task: Conductor - User Manual Verification 'Data Model & Backend Infrastructure' (Protocol in workflow.md)

## Phase 2: Shared Logic & Validation (TDD)
Extract common logic to ensure consistency across the application.

- [ ] Task: Implement Shared Lifespan Validation
    - [ ] Write unit tests for `validateLifespan` utility in `src/utils/dateUtils.test.ts`
    - [ ] Implement `validateLifespan` in `src/utils/dateUtils.ts`
- [ ] Task: Conductor - User Manual Verification 'Shared Logic & Validation' (Protocol in workflow.md)

## Phase 3: Frontend Persistence & Relationship Wizard (TDD)
Update the UI to correctly handle enhanced data structures and placeholder persistence.

- [ ] Task: Update Frontend Service Layer
    - [ ] Write failing tests for `FamilyService` enhanced sibling mapping
    - [ ] Update `FamilyService.ts` to handle `{id, type}` sibling mapping
- [ ] Task: Fix Sibling Placeholder Persistence in Modals
    - [ ] Write failing tests for `AddMemberModal` sibling placeholder creation
    - [ ] Update `handleSiblingUpdate` in `AddMemberModal.tsx` to persist new placeholders
    - [ ] Update `MemberBiography.tsx` to use the shared validation and enhanced persistence
- [ ] Task: Remove Frontend Timing Workarounds
    - [ ] Remove `setTimeout` retry logic from `FamilyTreeView.tsx`
- [ ] Task: Conductor - User Manual Verification 'Frontend Persistence & Relationship Wizard' (Protocol in workflow.md)

## Phase 4: Visualization & UX (TDD)
Correct the visual representation of complex families.

- [ ] Task: Fix Sibling Connecting Lines
    - [ ] Write failing tests for sibling bracket positioning in `FamilyTreeView.test.tsx`
    - [ ] Update SVG logic in `FamilyTreeView.tsx` to render horizontal brackets for multiple siblings
- [ ] Task: Display Custom Sibling Types
    - [ ] Update `TreeService.getSiblingType` to prioritize persisted types over derived types
- [ ] Task: Conductor - User Manual Verification 'Visualization & UX' (Protocol in workflow.md)
