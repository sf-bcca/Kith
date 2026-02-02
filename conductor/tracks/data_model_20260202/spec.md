# Specification: Family Member Data Model and Directory Search

## Overview
This track focuses on establishing a robust and scalable data model for family members and implementing a highly efficient directory search. This is the foundation for all family tree and social features in Kith.

## Goals
- Define a TypeScript-first data model for `FamilyMember`.
- Implement a centralized `FamilyService` for data management.
- Create a performant directory search component with filtering.
- Ensure 100% type safety and >80% test coverage for data operations.

## Data Model: `FamilyMember`
- `id`: string (UUID)
- `firstName`: string
- `lastName`: string
- `maidenName`: string (optional)
- `birthDate`: string (ISO date)
- `deathDate`: string (optional, ISO date)
- `gender`: 'male' | 'female' | 'other' | 'unknown'
- `bio`: string
- `profileImage`: string (URL)
- `relationships`: Object mapping roles to IDs (e.g., `{ father: 'id1', mother: 'id2', spouse: 'id3' }`)

## Components to Implement/Update
- `FamilyDirectory.tsx`: Refactor to use the new search logic and data model.
- `FamilyService.ts`: New service for fetching, searching, and filtering family members.
- `DirectorySearch.tsx`: New component for the search UI.

## Technical Requirements
- Use React Hooks for state management.
- Implement fuzzy search for name matching.
- Ensure responsive design for mobile users (touch-friendly targets).
