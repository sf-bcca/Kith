# Implementation Plan: Family Member Data Model and Directory Search [checkpoint: e05a6d8]

This plan follows the Test-Driven Development (TDD) process as defined in the project workflow.

## Phase 1: Data Modeling and Service Foundation [checkpoint: e05a6d8]
- [x] Task: Define `FamilyMember` type and mock data
    - [x] Create `types/family.ts` with the `FamilyMember` interface
    - [x] Create `mocks/familyData.ts` with representative test data
- [x] Task: Implement `FamilyService` core logic
    - [x] Write tests for `FamilyService.getAll()` and `FamilyService.getById()`
    - [x] Implement `FamilyService.ts` to pass the tests
- [ ] Task: Conductor - User Manual Verification 'Data Modeling and Service Foundation' (Protocol in workflow.md)

## Phase 2: Directory Search Logic
- [x] Task: Implement Fuzzy Search in `FamilyService`
    - [x] Write tests for `FamilyService.search(query: string)`
    - [x] Implement fuzzy search logic in `FamilyService.ts`
- [ ] Task: Implement Filtering (by gender, branch, etc.)
    - [ ] Write tests for `FamilyService.filter(criteria: FilterCriteria)`
    - [ ] Implement filtering logic
- [ ] Task: Conductor - User Manual Verification 'Directory Search Logic' (Protocol in workflow.md)

## Phase 3: UI Implementation
- [ ] Task: Create `DirectorySearch` UI Component
    - [ ] Write tests for `DirectorySearch` component (rendering, input handling)
    - [ ] Implement `DirectorySearch.tsx` using Tailwind CSS
- [ ] Task: Refactor `FamilyDirectory` to use `FamilyService`
    - [ ] Write integration tests for `FamilyDirectory`
    - [ ] Update `FamilyDirectory.tsx` to integrate search and service logic
- [ ] Task: Conductor - User Manual Verification 'UI Implementation' (Protocol in workflow.md)
