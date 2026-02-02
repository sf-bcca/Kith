# Implementation Plan: Interactive Family Tree Visualization

This plan follows the Test-Driven Development (TDD) process.

## Phase 1: Dynamic Tree Logic
- [x] Task: Implement `TreeData` helper functions
    - [x] Create `services/TreeService.ts` for tree-specific data fetching (e.g., `getTreeFor(memberId)`)
    - [x] Write tests for `TreeService` to ensure correct generation retrieval
- [ ] Task: Conductor - User Manual Verification 'Dynamic Tree Logic'

## Phase 2: FamilyTreeView Component Refactor
- [ ] Task: Refactor `FamilyTreeView` to use `TreeService`
    - [ ] Update `FamilyTreeView.tsx` to accept a `focusId` state
    - [ ] Dynamically render Generations 1 (Parents), 2 (Focus/Spouses), and 3 (Children)
- [ ] Task: Implement Navigation Logic
    - [ ] Add `onClick` handlers to nodes to update the `focusId`
    - [ ] Ensure the tree re-renders smoothly when the focus changes
- [ ] Task: Conductor - User Manual Verification 'FamilyTreeView Component Refactor'

## Phase 3: Polish and Interactions
- [ ] Task: Improve Connecting Lines
    - [ ] Update SVG lines to be dynamic based on the number of nodes
- [ ] Task: Integrate with Member Biography
    - [ ] Ensure clicking a node's details navigates to the `Biography` screen
- [ ] Task: Conductor - User Manual Verification 'Polish and Interactions'
