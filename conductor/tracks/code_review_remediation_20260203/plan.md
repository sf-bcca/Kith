# Implementation Plan - Code Review Remediation

This plan follows the Test-Driven Development (TDD) process.

## Phase 1: Backend Security & Validation [checkpoint: a119bf3]
- [x] Task: Implement Activity Type Validation af6c1d5
    - [x] Create test `tests/server_activity_validation.test.ts` asserting 400 for invalid types.
    - [x] Update `server/index.ts` to validate `type` against allowlist.
    - [x] Verify tests pass.
- [x] Task: Secure Activity Comments af6c1d5
    - [x] Update test `tests/server_activity_validation.test.ts` to assert comment schema (id, authorId, text, timestamp).
    - [x] Update `server/index.ts` to generate UUID/timestamp server-side for comments.
    - [x] Verify tests pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Service Layer Optimization [checkpoint: 904e3bf]
- [x] Task: TreeService Bulk Fetching e74eecb
    - [x] Create test `services/TreeService_performance.test.ts` mocking `FamilyService.getByIds`.
    - [x] Refactor `TreeService.ts` (`getAncestors`, `getDescendants`) to use `getByIds`.
    - [x] Verify tests pass.
- [x] Task: LocationService Caching & Rate Limiting e74eecb
    - [x] Create test `services/LocationService_throttling.test.ts` to verify caching behavior.
    - [x] Update `services/LocationService.ts` to implement `localStorage` cache and delay loop.
    - [x] Verify tests pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Frontend Refactoring & Hygiene
- [ ] Task: Horizontal Tree Layout Refactor
    - [ ] Create test `components/__tests__/HorizontalTree_layout.test.tsx` (snapshot/render test).
    - [ ] Refactor `HorizontalTree.tsx` to use Flexbox/Grid instead of absolute positioning.
    - [ ] Verify tests pass.
- [ ] Task: Console Log Hygiene
    - [ ] Update `src/utils/location.ts` to use `console.warn` for geocoding errors.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
