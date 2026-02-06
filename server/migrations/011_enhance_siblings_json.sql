-- Up Migration: Convert array of strings to array of objects with {id, type}
UPDATE family_members
SET siblings = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', elem,
      'type', 'Full'
    )
  )
  FROM jsonb_array_elements_text(siblings) AS elem
)
WHERE jsonb_typeof(siblings) = 'array'
  AND jsonb_array_length(siblings) > 0
  AND jsonb_typeof(siblings->0) = 'string';
