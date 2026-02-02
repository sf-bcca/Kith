# Specification: Backend Integration & API Development

## Overview
Currently, the Kith application uses mock data and an isolated backend. This track will bridge that gap by implementing a persistent database and a set of API endpoints to serve the frontend features.

## Goals
- Design and implement a PostgreSQL schema for family members and activities.
- Create RESTful API endpoints for:
    - Retrieving all family members (`GET /api/members`)
    - Retrieving a specific family member by ID (`GET /api/members/:id`)
    - Retrieving the activity feed (`GET /api/activities`)
    - Adding comments to activities (`POST /api/activities/:id/comments`)
- Refactor frontend `FamilyService.ts` and `ActivityService.ts` to use `fetch` or a similar library to communicate with the backend.
- Maintain existing functionality and tests during the transition.

## API Endpoints

### Family Members
- `GET /api/members`: Returns a list of all family members.
- `GET /api/members/:id`: Returns detailed information for a specific member.

### Activity Feed
- `GET /api/activities`: Returns a list of recent activities.
- `POST /api/activities/:id/comments`: Adds a comment to a specific activity.

## Database Schema

### Table: `family_members`
- `id`: UUID (Primary Key)
- `first_name`: VARCHAR(255)
- `last_name`: VARCHAR(255)
- `maiden_name`: VARCHAR(255) (nullable)
- `birth_date`: DATE
- `death_date`: DATE (nullable)
- `gender`: VARCHAR(50)
- `bio`: TEXT
- `profile_image`: TEXT
- `relationships`: JSONB (to store the mapping of roles to IDs)

### Table: `activities`
- `id`: UUID (Primary Key)
- `type`: VARCHAR(50) (e.g., 'story', 'photo', 'milestone')
- `member_id`: UUID (Foreign Key to `family_members.id`)
- `content`: TEXT
- `image_url`: TEXT (nullable)
- `timestamp`: TIMESTAMP
- `likes`: INTEGER
- `comments`: JSONB (array of comment objects)

## Technical Requirements
- Use `pg` library for database interactions in the backend.
- Ensure API endpoints are tested with unit/integration tests.
- Handle errors gracefully and return appropriate HTTP status codes.
- Use Environment Variables for API URLs in the frontend.
