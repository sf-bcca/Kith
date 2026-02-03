# Specification: Social Activity Feed Data Model and Interaction

## Overview
This track focuses on dynamicizing the social activity feed. Currently, the `ActivityFeed` component uses hardcoded data. We will implement a robust data model and service to manage family updates, photos, and milestones.

## Goals
- Define `Activity` and `ActivityType` in the data model.
- Implement `ActivityService` for fetching and managing family updates.
- Refactor `ActivityFeed.tsx` to render dynamic data from the service.
- Implement interaction logic for "Approve" and "Comment" actions.

## Data Model: `Activity`
- `id`: string (UUID)
- `type`: 'photo_added' | 'member_updated' | 'member_added' | 'milestone'
- `timestamp`: string (ISO date)
- `actorId`: string (ID of the member who performed the action)
- `targetId`: string (ID of the member the action relates to, optional)
- `content`: Object (dynamic based on type, e.g., `{ photoUrls: string[] }` or `{ oldDate: string, newDate: string }`)
- `status`: 'pending' | 'approved'
- `comments`: Array of `Comment` objects

## Components to Implement/Update
- `ActivityFeed.tsx`: Refactor to use `ActivityService`.
- `ActivityService.ts`: New service for fetching activities.
- `types/activity.ts`: New types for activity feed data.

## Technical Requirements
- TDD approach for all service logic.
- Responsive and touch-friendly UI.
- Mock data reflecting various activity types.
