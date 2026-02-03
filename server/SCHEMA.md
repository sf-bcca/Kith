# Kith Database Schema

This document provides a human-readable representation of the Kith database schema, managed via PostgreSQL migrations in `server/migrations/`.

## Tables

### family_members
Stores detailed profiles and system account information for all family members.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique identifier |
| first_name | VARCHAR(255) | NOT NULL, UNIQUE (composite) | | Legal first name |
| last_name | VARCHAR(255) | NOT NULL, UNIQUE (composite) | | Current surname |
| maiden_name | VARCHAR(255) | | | Birth surname (if applicable) |
| birth_date | DATE | NOT NULL, UNIQUE (composite) | | Date of birth |
| birth_place | VARCHAR(255) | | | City/Country of birth |
| death_date | DATE | | | Date of death (if applicable) |
| death_place | VARCHAR(255) | | | City/Country of death (if applicable) |
| gender | VARCHAR(50) | NOT NULL | | Gender identification |
| bio | TEXT | | | Personal biography or notes |
| profile_image | TEXT | | | URL or path to profile image |
| relationships | JSONB | | '{}' | Structured relationship data |
| role | VARCHAR(20) | | 'member' | System role (admin, member) |
| password | VARCHAR(255) | | | Hashed password for login |
| email | VARCHAR(255) | UNIQUE | | Contact email address |
| username | VARCHAR(255) | UNIQUE | | System username |
| dark_mode | BOOLEAN | | FALSE | User preference for UI theme |
| language | VARCHAR(10) | | 'en' | Preferred UI language |
| visibility | VARCHAR(20) | | 'family-only' | Profile privacy setting |
| data_sharing | BOOLEAN | | TRUE | Consent for data analytics |
| notifications_email | BOOLEAN | | TRUE | Email notification toggle |
| notifications_push | BOOLEAN | | TRUE | Push notification toggle |
| siblings | JSONB | | '[]' | Array of explicit sibling relationship links (UUIDs) |
| created_at | TIMESTAMPTZ | | CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMPTZ | | CURRENT_TIMESTAMP | Last record update time |

**Constraints:**
- `unique_member_identity`: UNIQUE(first_name, last_name, birth_date)

---

### activities
Stores social feed items, memories, and system-generated updates.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique identifier |
| type | VARCHAR(50) | NOT NULL | | Type of activity (e.g., memory, update) |
| member_id | UUID | REFERENCES family_members(id) | | Member who created/owns the activity |
| content | TEXT | NOT NULL | | The main text or narrative |
| image_url | TEXT | | | Optional image attachment |
| timestamp | TIMESTAMPTZ | | CURRENT_TIMESTAMP | Logical time of the activity |
| status | VARCHAR(20) | | 'approved' | Approval status (pending, approved, rejected) |
| likes | INTEGER | | 0 | Engagement count |
| comments | JSONB | | '[]' | List of nested comment objects |
| created_at | TIMESTAMPTZ | | CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMPTZ | | CURRENT_TIMESTAMP | Last record update time |

**Relationships:**
- `member_id` -> `family_members(id)` (Many-to-One, ON DELETE CASCADE)
