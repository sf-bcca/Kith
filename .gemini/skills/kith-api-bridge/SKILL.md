---
name: kith-api-bridge
description: Synchronizes data model changes across the full stack (SQL migrations, SCHEMA.md, TypeScript types, and Services). Use when adding, renaming, or removing fields in the family or user data models to ensure consistency and prevent runtime type errors.
---

# Kith API Bridge

This skill ensures that the "Ripple Effect" of a data model change is handled correctly across all layers of the Kith application.

## The Ripple Effect Workflow

When a data model change is requested:

1.  **Verify SQL**: Ensure a migration exists in `server/migrations/`.
2.  **Update Types**: Modify the relevant TypeScript interfaces in `types/` (e.g., `family.ts`, `activity.ts`). Use camelCase for TypeScript fields.
3.  **Audit Services**: Update `FamilyService.ts` and `ActivityService.ts` to fetch/send the new fields.
4.  **Sync Schema**: Trigger the `kith-schema-maintainer` to update `server/SCHEMA.md`.
5.  **Controller Check**: If the change affects the backend, update the controllers in `server/controllers/` to handle the new database columns.

## Guidelines
- **Naming**: Always convert database `snake_case` to frontend `camelCase`.
- **Consistency**: Refer to [type-mapping.md](references/type-mapping.md) for standard SQL-to-TS mappings.
- **Null Safety**: Always check if new fields should be optional (`?`) in TypeScript.