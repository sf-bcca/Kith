# Kith

Kith is a modern family history and genealogy application built to help you visualize, explore, and preserve your family's legacy.

## Features

- **Interactive Family Trees:**
  - **Vertical Tree:** Traditional hierarchical view of ancestry and descendants.
  - **Horizontal Tree:** Space-efficient layout for wide family structures.
  - **Pedigree Chart:** Direct lineage visualization for ancestors.
  - **Fan Chart:** Compact circular visualization of multiple generations.

- **Member Discovery:**
  - **Biography View:** Detailed profiles with personal history and data.
  - **Family Directory:** Searchable list of all family members.
  - **Discover:** Tools to find new connections or explore data.

- **Engagement:**
  - **Activity Feed (Memories):** Social-style feed of recent updates, photos, and stories.
  - **Admin Dashboard:** Tools for managing application settings and toggling dark mode.

## Tech Stack

- **Frontend:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), TypeScript, Tailwind CSS (via CDN)
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL
- **Infrastructure:** Docker, Docker Compose
- **Testing:** Vitest, React Testing Library
- **Icons:** Material Symbols

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Kith
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Gemini API key (used for AI-powered features):
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Application

- **Development Server:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

- **Production Build:**
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

- **Run Tests:**
  ```bash
  npm run test
  ```

## Project Structure

```
Kith/
├── components/          # UI Components (Views & Widgets)
│   ├── FamilyTreeView.tsx
│   ├── MemberBiography.tsx
│   ├── ActivityFeed.tsx
│   └── ...
├── context/             # React Context Providers
│   └── FamilyContext.tsx
├── server/              # Backend API
│   ├── index.ts         # Server Entry Point
│   ├── db.ts            # Database Connection
│   └── Dockerfile       # Backend Container Config
├── services/            # Business Logic & Data Fetching
│   ├── FamilyService.ts
│   ├── TreeService.ts
│   └── ActivityService.ts
├── types/               # TypeScript Definitions
├── mocks/               # Mock Data for Development
├── App.tsx              # Main Entry & Navigation Controller
└── docker-compose.yml   # Infrastructure Orchestration
```

## Navigation

The application uses a custom state-based navigation system located in `App.tsx`. A global "View Switcher" is available in the top-right corner for quick access to all screens during development.