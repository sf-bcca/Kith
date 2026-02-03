# Implementation Plan: Collaborative Editing and Admin Dashboard

This plan follows the Test-Driven Development (TDD) process.

## Phase 1: Full Member Lifecycle (Edit/Delete)
- [x] Task: Relax IDOR checks for member updates [4308a1e]
    - [x] Update `server/middleware/auth.ts` or `server/index.ts` to allow family members to edit others (perhaps based on a role or just any authenticated user for now in this collaborative model).
- [x] Task: Implement Member Deletion in UI [8b3a1e0]
    - [x] Write integration tests for deleting a member from `MemberBiography`.
    - [x] Update `MemberBiography.tsx` to include a delete button and confirmation.
- [x] Task: Enable Editing for All in UI [8b3a1e0]
    - [x] Update `MemberBiography.tsx` to show the edit button for all members, not just the logged-in user.
- [ ] Task: Conductor - User Manual Verification 'Phase 1'

## Phase 2: Backend Admin API
- [x] Task: Implement Admin Stats Endpoint [6f3a1e0]
    - [x] Write integration tests for `GET /api/admin/stats`.
    - [x] Implement the endpoint in `server/index.ts`.
- [x] Task: Implement Pending Activities Endpoint [6f3a1e0]
    - [x] Write integration tests for `GET /api/activities?status=pending`.
    - [x] Update `GET /api/activities` to support filtering by status.
- [x] Task: Implement Activity Approval Endpoint [6f3a1e0]
    - [x] Write integration tests for `PATCH /api/activities/:id/approve`.
    - [x] Implement the endpoint in `server/index.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2'

## Phase 3: Dynamic Admin Dashboard UI
- [x] Task: Update Admin Dashboard Stats [9d3a1e0]
    - [x] Update `AdminDashboard.tsx` to fetch and display real stats.
- [x] Task: Implement Approval Queue in UI [9d3a1e0]
    - [x] Update `AdminDashboard.tsx` to list pending activities and allow approving them.
- [ ] Task: Conductor - User Manual Verification 'Phase 3'
