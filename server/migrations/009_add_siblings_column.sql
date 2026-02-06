-- Add siblings JSONB column to store explicit sibling relationship links
ALTER TABLE family_members
ADD COLUMN siblings JSONB DEFAULT '[]'::JSONB;

-- Create index on siblings for faster lookups when querying sibling relationships
CREATE INDEX idx_family_members_siblings ON family_members USING GIN (siblings);
