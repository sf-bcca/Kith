-- Add password column to family_members if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='family_members' AND column_name='password') THEN
        ALTER TABLE family_members ADD COLUMN password VARCHAR(255);
    END IF;
END $$;
