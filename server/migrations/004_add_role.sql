-- Migration: Add role column to family_members table
ALTER TABLE family_members 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'member';

-- Set existing members as admins for now (bootstrap)
UPDATE family_members SET role = 'admin' WHERE role = 'member';
