# Implementation Plan: Backend Infrastructure Setup

## Phase 1: Local Backend Project Initialization [checkpoint: 1f0fefb]
- [x] Task: Create `server/` directory and initialize Node.js project (npm init) 8d74883
- [x] Task: Install backend dependencies (express, pg, typescript, @types/node, @types/express, @types/pg, ts-node-dev, dotenv) 00347e8
- [x] Task: Configure `server/tsconfig.json` to match project standards ba5dfb6
- [x] Task: Create a basic "Hello World" Express server in `server/index.ts` b1bb9a3
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Docker & Database Configuration
- [x] Task: Create a `.env` file in the project root for database credentials and ports 00250fd
- [x] Task: Create a `Dockerfile` for the backend service c14d2ad
- [ ] Task: Create a `docker-compose.yml` defining `postgres` and `backend` services
- [ ] Task: Update the existing frontend to be served or orchestrated via Docker (optional, but recommended for full orchestration)
- [ ] Task: Verify that `docker-compose up` starts the PostgreSQL container and the Backend container
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Connectivity & Health Check
- [ ] Task: Implement database connection logic using the `pg` pool in the backend
- [ ] Task: Implement the `GET /api/health` endpoint that checks both server status and DB connectivity
- [ ] Task: Write unit tests for the health check endpoint (mocking the DB connection)
- [ ] Task: Verify that the backend successfully logs "Connected to PostgreSQL" on startup in the Docker container
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
