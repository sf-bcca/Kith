# Kith

## Project Overview
**Kith** is a comprehensive family history and genealogy application built with React 19 and Vite. It features interactive tools for visualizing and managing family data, including family trees, pedigree charts, fan charts, and social activity feeds.

### Key Technologies
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via utility classes)
- **Testing:** Vitest, React Testing Library
- **Icons:** Material Symbols (referenced in `App.tsx` and `index.html`)

## Building and Running

### Prerequisites
- Node.js installed
- `GEMINI_API_KEY` set in `.env.local` (injected via `vite.config.ts` into `process.env`).

### Key Commands
| Command | Description |
| :--- | :--- |
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run unit tests using Vitest |

## Architecture & Conventions

### Entry & Navigation
- **Entry Point:** `index.tsx` renders `App.tsx`.
- **Navigation:** Custom state-based routing managed in `App.tsx` using the `Screen` enum (WELCOME, TREE, BIO, MEMORIES, DISCOVER, SETTINGS, PEDIGREE, FAN, DIRECTORY, HORIZONTAL, ADMIN, DNA_MAP).
- **Onboarding:** `WelcomeView.tsx` handles initial setup and first-member creation.
- **Global UI:** A floating "View Switcher" (top-right) allows quick switching between screens for development.

### Directory Structure

#### `components/`
Contains all UI views and widgets.
- **Core Views:**
    - `FamilyTreeView.tsx`: Main interactive hierarchical tree.
    - `HorizontalTree.tsx`: Alternative horizontal layout.
    - `PedigreeChart.tsx` / `FanChart.tsx`: Ancestry visualizations.
    - `DNAMap.tsx` / `WorldMap.tsx`: Geospatial and genetic data visualizations.
    - `MemberBiography.tsx`: Detailed profile view.
    - `MediaGallery.tsx`: View of family photos and documents.
    - `ActivityFeed.tsx`: Social stream of updates ("Memories").
    - `FamilyDirectory.tsx`: List/Grid view of members.
    - `DiscoverView.tsx`: Exploration tools.
    - `FamilyManagement.tsx`: Tools for managing family relationships and members.
    - `SettingsView.tsx`: Main settings hub with sub-sections.
    - `AccountSettings.tsx` / `PreferenceSettings.tsx` / `PrivacySettings.tsx`: Granular user settings.
    - `WelcomeView.tsx`: Initial onboarding and login screen.
- **Widgets & Modals:**
    - `AddMemberModal.tsx`: Interface for adding new family members.
    - `AddMediaModal.tsx`: Modal for uploading family media.
    - `DirectorySearch.tsx`: Search bar for the directory.
    - `BottomNav.tsx`: Navigation bar for mobile-friendly views.
- **Admin:**
    - `AdminDashboard.tsx`: Administration and Dark Mode toggle.

#### `server/`
Node.js/Express backend with PostgreSQL.
- `index.ts`: API entry point.
- `db.ts`: Database connection and query utilities.
- `controllers/`: Request handlers (e.g., `settingsController.ts`).
- `middleware/`: Custom Express middleware (auth, error handling).
- `routes/`: API route definitions (e.g., `settings.ts`).
- `migrations/`: SQL migration files for schema evolution.
- `scripts/`: Database management scripts (migrate, reset, seed).

#### `services/`
Frontend logic for communicating with the backend API.
- `FamilyService.ts`: Core CRUD for family members.
- `TreeService.ts`: Logic for tree traversal and structure.
- `ActivityService.ts`: Manages social activity data.
- `LocationService.ts`: Handles geospatial data for maps.
- `DiscoverService.ts`: Discovery features and intelligent connections.

#### `scripts/`
Utility scripts for manual verification and maintenance.
- `manual_verify_service.ts`: Script for testing FamilyService in a Node environment.
- `manual_verify_tree.ts`: Script for testing TreeService logic.
- `check-secrets.cjs`: Pre-commit hook script to prevent secret leakage.

#### `context/`
- `FamilyContext.tsx`: React Context for global state management.

#### `types/`
TypeScript definitions for core domain entities.
- `family.ts`: `FamilyMember`, `Relationship`, etc.
- `activity.ts`: `ActivityItem`, `Feed`, etc.

#### `src/utils/`
Shared utility functions for data formatting, date manipulation, etc.

#### `conductor/`
Project development tracks, styleguides, and planning documents.

#### `mocks/`
Static data for development and testing.

### Styling
- **Tailwind:** Utility-first styling (via class names).
- **Dark Mode:** Reactive to user preferences, toggled via `PreferenceSettings` or `AdminDashboard`, implemented via the `.dark` class on the root element.

### Testing
- **Frontend:** Vitest and React Testing Library in `components/__tests__` and `services/`.
- **Backend:** API tests in `tests/` using Supertest.
- **Setup:** `vitest.config.ts` and `vitest.setup.ts`.

## Specialized Skills

The project includes custom Gemini skills to automate maintenance tasks:
- **kith-doc-maintainer:** Synchronizes `AGENTS.md` and `README.md` with the codebase structure. Use this after adding new views, services, or significantly changing the project architecture.
- **kith-schema-maintainer:** Maintains `server/SCHEMA.md` by consolidating PostgreSQL migration files. Use this whenever a new database migration is added.
- **kith-tree-architect:** Expert guidance for genealogy-specific data structures, recursive tree traversal, and complex family visualization layouts (Fan Charts, Pedigrees).
- **kith-test-factory:** Specialized in generating complex, realistic mock family datasets and unit tests.
- **kith-conductor-manager:** Orchestrates and maintains project development tracks in the `conductor/` directory.
- **kith-api-bridge:** Synchronizes data model changes across the full stack (SQL migrations, SCHEMA.md, TypeScript types, and Services).