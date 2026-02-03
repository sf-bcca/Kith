-- Migration: Add status column to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved';

-- Note: We default to approved so existing data isn't hidden. 
-- New activities can be created with 'pending' status later.
