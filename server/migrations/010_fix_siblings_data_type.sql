-- Convert any siblings values that are '{}' to '[]'
UPDATE family_members 
SET siblings = '[]'::jsonb 
WHERE jsonb_typeof(siblings) = 'object' AND siblings = '{}'::jsonb;
