# Track Spec: Dynamic Discovery & Heritage Hub

## Overview
Transform the static "Discover" view into a dynamic, data-driven hub that surfaces family milestones, data-quality "hints", and research tasks. This feature aims to increase user engagement by providing daily reasons to return to the application.

## User Stories
- As a user, I want to see whose birthday or anniversary it is today so I can celebrate with my family.
- As a researcher, I want the system to point out gaps in my family tree (missing dates, parents, or photos) so I know what to work on next.
- As a user, I want a centralized view of "Hints" that might help me connect with new records or branches.

## Functional Requirements
- **On This Day Engine:**
    - Scan `family_members` for birth and death anniversaries matching the current month and day.
    - (Future) Support marriage anniversaries once relationship dates are implemented.
- **Hint Engine:**
    - Identify members with missing critical data:
        - Missing profile photo.
        - Missing biography.
        - Missing birth date.
        - Missing parent relationships.
    - Surface these as actionable "Tasks" in the Discover view.
- **API Endpoint:**
    - `GET /api/discover/summary`: Returns a combined object containing "On This Day" events, data quality hints, and system tasks.
- **UI Integration:**
    - Update `DiscoverView.tsx` to fetch data from the new endpoint.
    - Replace hardcoded "Daily Heritage" and "Hints & Tasks" sections with real data.

## Technical Considerations
- The "On This Day" logic should be performed on the backend to avoid fetching the entire database to the client.
- Hints should be prioritized (e.g., missing parents > missing photo).
- Ensure the `DiscoverView` handles empty states gracefully if no events or hints are found.
