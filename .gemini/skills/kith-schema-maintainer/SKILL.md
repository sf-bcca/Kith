---
name: kith-schema-maintainer
description: Maintains a consolidated server/SCHEMA.md file based on PostgreSQL migrations. Use when new migrations are added or when the database structure needs to be audited.
---

# Kith Schema Maintainer

This skill maintains a human-readable representation of the database schema, derived from SQL migration files.

## Workflow

1.  **Extract Schema**:
    -   Read all files in `server/migrations/*.sql` in sequential order (001, 002, ...).
    -   Track the final state of each table, including columns, types, and constraints.

2.  **Generate/Update server/SCHEMA.md**:
    -   If the file doesn't exist, create it.
    -   Use the following Markdown structure for each table:

    ```markdown
    ### [Table Name]
    [Brief description of what the table stores]

    | Column | Type | Constraints | Default | Description |
    | :--- | :--- | :--- | :--- | :--- |
    | id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique identifier |
    | ... | ... | ... | ... | ... |

    **Relationships:**
    - `[column_name]` -> `[other_table]([other_column])` ([Relationship Type])
    ```

3.  **Cross-reference with Types**:
    -   Optionally check `types/` to ensure TypeScript interfaces match the database schema.

## Guidelines

-   **Consolidation**: The `SCHEMA.md` should reflect the *current* state of the database, not a history of changes (which is what migrations are for).
-   **Precision**: Ensure types (e.g., `VARCHAR(255)`, `JSONB`, `TIMESTAMP WITH TIME ZONE`) are captured exactly as defined in SQL.
-   **Relationships**: Clearly document foreign key constraints.