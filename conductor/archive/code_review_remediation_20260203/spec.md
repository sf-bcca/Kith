# Track: Code Review Remediation & Performance Optimization

## Overview
This track addresses critical security vulnerabilities, performance bottlenecks, and maintainability issues identified during the recent code review. The primary focus is on fixing N+1 queries in the TreeService, implementing rate-limiting for the LocationService, securing backend API endpoints, and robustifying the HorizontalTree layout.

## Functional Requirements

### 1. Backend Security & Validation
- **Activity Creation:** `POST /api/activities` must validate the `type` field against a strict allowlist (e.g., `photo_added`, `member_updated`, `member_added`, `milestone`). Invalid types must return a 400 error.
- **Comment Creation:** `POST /api/activities/:id/comments` must:
    - Validate the presence of `authorId` and `text`.
    - Generate a unique `id` (UUID) and `timestamp` (ISO string) on the server-side before persisting.

### 2. Service Layer Performance
- **Tree Service Optimization:** Refactor `getAncestors` and `getDescendants` in `TreeService.ts` to replace iterative `getById` calls with bulk `getByIds` fetching. This must reduce the number of network requests for a standard 3-generation tree from ~30 to ~3.
- **Location Service Throttling:** Refactor `LocationService.ts` to:
    - Implement a client-side cache (e.g., using `localStorage`) for geocoding results to prevent redundant API calls.
    - Implement a rate-limiting mechanism (delay) for the `getAllOrigins` loop to respect the Nominatim API limit (1 request/second).

### 3. Frontend UI/UX
- **Horizontal Tree Layout:** Refactor `HorizontalTree.tsx` (and `AncestorsView`/`DescendantsView`) to replace hardcoded absolute positioning with a flexible layout model (Flexbox, Grid, or recursive component rendering) that adapts to varying family sizes without node overlap.
- **Console Hygiene:** Downgrade `console.error` logs in `src/utils/location.ts` to `console.warn` (or silence them) for expected non-critical failures like geocoding timeouts.

## Non-Functional Requirements
- **Backwards Compatibility:** API response shapes must remain unchanged.
- **Type Safety:** All new code must be strictly typed.
- **Tests:** Existing tests must pass; new logic should be covered where applicable.

## Acceptance Criteria
- [ ] `POST /api/activities` with an invalid type returns HTTP 400.
- [ ] Comments created via API have server-generated IDs and timestamps.
- [ ] Loading the Fan Chart or Pedigree Chart triggers batch requests (verifiable via Network tab), not dozens of sequential requests.
- [ ] Repeated visits to the Map view do not trigger new geocoding network requests (served from cache).
- [ ] The Horizontal Tree correctly renders complex family structures (e.g., many siblings) without visual overlap.
- [ ] Console logs are free of "Geocoding error" spam during normal operation.
