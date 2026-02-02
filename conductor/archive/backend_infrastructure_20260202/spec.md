# Track Specification: Backend Infrastructure Setup

## 1. Overview
This track focuses on establishing the foundational backend infrastructure for the Kith application. We will transition from a frontend-only prototype to a full-stack Dockerized application. The goal is to configure a Node.js/Express server and a PostgreSQL database, orchestrated via Docker Compose, ensuring they can communicate effectively.

## 2. Goals
- Initialize a new Node.js + Express project structure.
- Configure a PostgreSQL database instance using Docker.
- Orchestrate the Frontend (Vite), Backend (Express), and Database (Postgres) using Docker Compose.
- Establish a verified connection between the Backend and Database.
- Provide a clear "Health Check" endpoint to verify the system status.

## 3. Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js (TypeScript)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose
- **ORM/Query Builder:** strictly use the `pg` driver for connectivity tests.

## 4. Functional Requirements
- **Server Initialization:** The backend server must start successfully on a configured port (e.g., 3000 or 8080).
- **Database Connectivity:** The backend must be able to connect to the PostgreSQL service defined in Docker Compose.
- **Health Check API:** A GET request to `/api/health` must return a `200 OK` status with a JSON payload indicating the server and database status (e.g., `{ status: "ok", database: "connected" }`).
- **Docker Orchestration:** Running `docker-compose up` must start the Database, Backend, and Frontend services without crashing.

## 5. Non-Functional Requirements
- **Configuration:** Environment variables (e.g., DB credentials, ports) must be managed via `.env` files (and ignored in git).
- **TypeScript:** The backend must be written in TypeScript, sharing a configuration style similar to the frontend where appropriate.
- **Hot Reloading:** The development environment should support hot-reloading for the backend code (e.g., using `nodemon` or `tsx watch`).

## 6. Acceptance Criteria
- [ ] A new `backend/` or `server/` directory exists with a `package.json` and `tsconfig.json`.
- [ ] A `docker-compose.yml` file is created (or updated) to define `postgres` and `backend` services.
- [ ] The command `docker-compose up` starts all services successfully.
- [ ] Accessing `http://localhost:<API_PORT>/api/health` returns a success JSON response.
- [ ] The backend logs confirm a successful connection to the PostgreSQL database.

## 7. Out of Scope
- User Authentication (Login/Signup).
- Data migration scripts (beyond initial schema creation if strictly necessary for connection test).
- CRUD operations for Family Members or Activity Feed.
- Frontend integration (fetching data from this new backend in the UI).
