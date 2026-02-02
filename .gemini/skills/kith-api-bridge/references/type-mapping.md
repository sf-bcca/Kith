# Data Type Mapping Rules

Use these rules to ensure consistency between the PostgreSQL database and the TypeScript frontend.

| SQL Type | TypeScript Type | Validation/Note |
| :--- | :--- | :--- |
| `UUID` | `string` | Use `v4` for new IDs |
| `VARCHAR` / `TEXT` | `string` | |
| `BOOLEAN` | `boolean` | Default should be defined in both layers |
| `TIMESTAMP` | `string` | ISO 8601 format |
| `JSONB` | `any` or Interface | Define a specific interface in `types/` |
| `INTEGER` | `number` | |

## File Responsibility Chain

When a field is added (e.g., `middle_name`):

1.  **Database**: `server/migrations/XXX_add_field.sql` (Snake Case)
2.  **Documentation**: `server/SCHEMA.md` (Update via `kith-schema-maintainer`)
3.  **App Types**: `types/family.ts` (Camel Case)
4.  **Service Mapping**: `server/controllers/settingsController.ts` or `server/db.ts` (Handle snake_case to camelCase conversion)
5.  **Frontend Service**: `services/FamilyService.ts` (Update methods to handle new field)
