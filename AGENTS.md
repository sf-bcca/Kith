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
- **Navigation:** Custom state-based routing managed in `App.tsx` using the `Screen` enum.
- **Global UI:** A floating "View Switcher" (top-right) allows quick switching between screens.

### Directory Structure

#### `components/`
Contains all UI views and widgets.
- **Core Views:**
    - `FamilyTreeView.tsx`: Main interactive hierarchical tree.
    - `HorizontalTree.tsx`: Alternative horizontal layout.
    - `PedigreeChart.tsx` / `FanChart.tsx`: Ancestry visualizations.
    - `MemberBiography.tsx`: Detailed profile view.
    - `ActivityFeed.tsx`: Social stream of updates ("Memories").
    - `FamilyDirectory.tsx`: List/Grid view of members.
    - `DiscoverView.tsx`: Exploration tools.
    - `SettingsView.tsx`: User preferences.
- **Admin:**
    - `AdminDashboard.tsx`: Administration and Dark Mode toggle.

#### `services/`
Encapsulates business logic and data manipulation.
- `FamilyService.ts`: Core CRUD for family members.
- `TreeService.ts`: Logic for tree traversal and structure.
- `ActivityService.ts`: Manages social activity data.

#### `context/`
- `FamilyContext.tsx`: React Context for global state management (if applicable/used).

#### `types/`
TypeScript definitions for core domain entities.
- `family.ts`: `FamilyMember`, `Relationship`, etc.
- `activity.ts`: `ActivityItem`, `Feed`, etc.

#### `mocks/`
Static data for development without a backend.
- `familyData.ts`
- `activityData.ts`

### Styling
- **Tailwind:** Utility-first styling (e.g., `bg-gray-50`, `text-slate-900`).
- **Dark Mode:** Toggled via `AdminDashboard`, implemented by adding the `.dark` class to the HTML root.

### Testing
- **Framework:** Vitest
- **Setup:** `vitest.config.ts` and `vitest.setup.ts`
- **Location:** `__tests__` folders within `components/` and co-located `.test.ts` files in `services/`.