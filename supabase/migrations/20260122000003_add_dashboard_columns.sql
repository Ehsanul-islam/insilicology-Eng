-- Add dashboard enhancement columns to courses table

-- Create course_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE course_type AS ENUM ('live', 'recorded', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add columns to courses table safely
ALTER TABLE courses ADD COLUMN IF NOT EXISTS whatsapp_group_link text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS start_date timestamp with time zone;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_type course_type DEFAULT 'recorded';

-- Add comment for documentation
COMMENT ON COLUMN courses.whatsapp_group_link IS 'URL for the WhatsApp group for live courses';
COMMENT ON COLUMN courses.start_date IS 'Start date/time for live courses';
COMMENT ON COLUMN courses.course_type IS 'Type of course: live, recorded, or hybrid';
