# Implementation Plan: Backend Integration & API Development

This plan follows the Test-Driven Development (TDD) process as defined in the project workflow.

## Phase 1: Database Schema and Seed Data [checkpoint: 521a0d8]
- [x] Task: Create database migration scripts
    - [x] Create `server/migrations/001_initial_schema.sql` with `family_members` and `activities` tables.
- [x] Task: Implement a seed script
    - [x] Create `server/scripts/seed.ts` to populate the DB with data from `mocks/familyData.ts` and `mocks/activityData.ts`.
- [x] Task: Conductor - User Manual Verification 'Phase 1'

## Phase 2: Backend API Implementation [checkpoint: 3d1e2a0]
- [x] Task: Implement Family Member endpoints
    - [x] Write integration tests for `GET /api/members` and `GET /api/members/:id`.
    - [x] Implement the routes and controllers in `server/index.ts` (or modularized files).
- [x] Task: Implement Activity Feed endpoints
    - [x] Write integration tests for `GET /api/activities` and `POST /api/activities/:id/comments`.
    - [x] Implement the routes and controllers.
- [x] Task: Conductor - User Manual Verification 'Phase 2'

## Phase 3: Frontend Integration [checkpoint: 7f2e1a0]
- [x] Task: Configure Frontend to use Backend API
    - [x] Add `VITE_API_URL` to `.env`.
    - [x] Update `FamilyService.ts` to fetch data from the backend.
    - [x] Update `ActivityService.ts` to fetch data and post comments to the backend.
- [x] Task: Verify end-to-end functionality
    - [x] Run the full stack (Frontend + Backend + DB) and verify UI updates correctly.
- [x] Task: Conductor - User Manual Verification 'Phase 3'
