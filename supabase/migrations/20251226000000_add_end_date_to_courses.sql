-- Add end_date column to courses table
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add comment for documentation
COMMENT ON COLUMN public.courses.end_date IS 'The end date of the course';
