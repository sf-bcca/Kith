# Implementation Plan - Security Remediation 20260202

This plan outlines the steps to remediate identified security vulnerabilities, focusing on authentication, password security, and data sanitization.

## Phase 1: Password Security & Privacy [checkpoint: 160dbdc]
*Goal: Implement secure password storage and prevent credential leakage.*

- [x] Task: Write Tests: Verify that member creation/update hashes passwords and retrieval excludes passwords [6e7d218]
    - [x] Create tests in `tests/security_passwords.test.ts` to check password hashing in the database.
    - [x] Create tests to verify that `/api/members` endpoints do not return the `password` field.
- [x] Task: Implement: Password hashing using `bcrypt` [05a3787]
    - [x] Update `server/controllers/settingsController.ts` and `server/index.ts` to hash passwords on create/update.
    - [x] Update existing members in the database to have hashed passwords (not needed as seed is empty/no plain passwords).
- [x] Task: Implement: Password exclusion from API responses [05a3787]
    - [x] Update all SQL queries in controllers and `server/index.ts` to exclude the `password` column.
    - [x] Update `services/FamilyService.ts` and `types/family.ts` to remove `password` from frontend models.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Password Security & Privacy' (Protocol in workflow.md) [160dbdc]

## Phase 2: JWT Authentication & IDOR Protection
*Goal: Secure API endpoints with JWT and prevent unauthorized data access.*

- [ ] Task: Write Tests: Authentication middleware and protected routes
    - [ ] Create tests in `tests/auth_middleware.test.ts` to verify 401/403 responses for unauthenticated/unauthorized requests.
- [ ] Task: Implement: JWT Authentication logic
    - [ ] Add `jsonwebtoken` and `@types/jsonwebtoken` to `server/package.json`.
    - [ ] Create an auth middleware in `server/middleware/auth.ts`.
    - [ ] Implement `/api/auth/login` endpoint to issue JWTs.
- [ ] Task: Implement: Protected routes and IDOR checks
    - [ ] Apply auth middleware to all sensitive member and settings routes.
    - [ ] Implement checks to ensure users can only modify their own data based on JWT `sub`.
- [ ] Task: Implement: Frontend JWT handling
    - [ ] Update `FamilyService.ts` to store the token and include it in `Authorization` headers.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: JWT Authentication & IDOR Protection' (Protocol in workflow.md)

## Phase 3: Hardening & Sanitization
*Goal: Implement generic error handling and prevent CSS injection.*

- [ ] Task: Write Tests: Error responses and URL sanitization
    - [ ] Create tests to verify generic 500 responses without leakages.
    - [ ] Create tests for `photoUrl` sanitization logic.
- [ ] Task: Implement: Centralized Error Handling
    - [ ] Create an error handling middleware in `server/middleware/error.ts`.
    - [ ] Update Express app to use this middleware for all routes.
- [ ] Task: Implement: CSS Injection Prevention
    - [ ] Create a URL validation utility in `components/FamilyTreeView.tsx` or a shared utility file.
    - [ ] Apply validation to the `photoUrl` before rendering in the tree.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Hardening & Sanitization' (Protocol in workflow.md)
