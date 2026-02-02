# Conductor Track Management

## Track Lifecycle
1.  **Creation**: Create folder in `conductor/tracks/` with `metadata.json`, `spec.md`, and `plan.md`.
2.  **Active**: Execute tasks defined in `plan.md`. Update status in `metadata.json`.
3.  **Completion**: Verify all tasks are checked.
4.  **Archiving**: Move completed tracks to `conductor/archive/` and update `conductor/tracks.md`.

## Track Spec Template (`spec.md`)
```markdown
# Specification: [Track Name]

## Goal
[High-level objective]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Success Criteria
- [ ] Criteria 1
```

## Track Plan Template (`plan.md`)
```markdown
# Implementation Plan: [Track Name]

## Phase 1: Setup
- [ ] Task 1

## Phase 2: Implementation
- [ ] Task 2
```
