---
name: kith-conductor-manager
description: Orchestrates and maintains project development tracks in the conductor/ directory. Use when creating new tracks, updating implementation plans, archiving completed features, or synchronizing tracks.md with the current state of development.
---

# Kith Conductor Manager

This skill provides expert management of the Kith project's roadmap and feature tracks using the Conductor protocol.

## Core Workflows

### 1. Track Creation & Synchronization
- **New Feature**: When starting a new feature (e.g., "Advanced Search"), use the templates in [track-templates.md](references/track-templates.md) to scaffold the `conductor/tracks/` folder.
- **Index Update**: Always ensure `conductor/tracks.md` reflects the current status (Active, Proposed, Completed) of all tracks.

### 2. Implementation Planning
- **Detailed Tasks**: Break down high-level requirements from `spec.md` into actionable items in `plan.md`.
- **Progress Tracking**: Update `plan.md` checkboxes as work is completed. If a task's scope changes, reflect it in the plan immediately.

### 3. Cleanup & Archiving
- **Archiving**: Move tracks from `tracks/` to `archive/` once fully implemented and verified. Ensure any leftover documentation is consolidated or removed.

## Guidelines
- **Consistency**: Resolve file paths using the Universal File Resolution Protocol (Index -> Link -> Path).
- **Communication**: When asked about "the plan", always refer to the specific active track plan in `conductor/tracks/`.
- **Structure**: Maintain the strict separation between Specification (`spec.md`) and Implementation (`plan.md`).