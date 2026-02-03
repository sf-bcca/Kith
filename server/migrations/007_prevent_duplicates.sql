-- Migration: Prevent duplicate users and cleanup existing ones

-- 1. Cleanup duplicates
-- We keep the record that has a password (priority) or is the most recently created.
WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY first_name, last_name, birth_date 
               ORDER BY 
                   CASE WHEN password IS NOT NULL THEN 1 ELSE 0 END DESC, -- Prefer records with passwords
                   created_at DESC -- Then prefer newer records
           ) as rn
    FROM family_members
)
DELETE FROM family_members
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- 2. Add Unique Constraint on (first_name, last_name, birth_date)
ALTER TABLE family_members
ADD CONSTRAINT unique_member_identity UNIQUE (first_name, last_name, birth_date);

-- 3. Add Unique Constraint on Email (if provided)
ALTER TABLE family_members
ADD CONSTRAINT unique_member_email UNIQUE (email);

-- 4. Add Unique Constraint on Username (if provided)
ALTER TABLE family_members
ADD CONSTRAINT unique_member_username UNIQUE (username);
