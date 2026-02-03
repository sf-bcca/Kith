# Implementation Plan: Dynamic Discovery & Heritage Hub

This plan follows the Test-Driven Development (TDD) process.

## Phase 1: Backend "On This Day" & Discovery API
- [x] Task: Implement "On This Day" query logic
    - [x] Write integration tests for `GET /api/discover/summary`.
    - [x] Implement the `onThisDay` calculation in the backend.
    - [x] Implement the `GET /api/discover/summary` endpoint.
- [x] Task: Implement basic Hint Engine
    - [x] Extend the summary endpoint to include data quality hints (missing bio, photo, dates).
- [x] Task: Conductor - User Manual Verification 'Phase 1'

## Phase 2: Frontend Integration
- [x] Task: Update `ActivityService` or create `DiscoverService`
    - [x] Implement `getDiscoverSummary()` in the frontend service layer.
- [x] Task: Refactor `DiscoverView`
    - [x] Integrate the new service to fetch real data.
    - [x] Map backend summary data to the existing UI sections.
- [x] Task: Conductor - User Manual Verification 'Phase 2'

## Phase 3: Polish & Edge Cases
- [x] Task: Handle empty states and error handling in UI.
- [x] Task: Ensure "On This Day" correctly handles different timezones if applicable.
- [x] Task: Conductor - User Manual Verification 'Phase 3'
