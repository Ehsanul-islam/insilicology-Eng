-- ============================================
-- Migration: Add instructor_id to courses table
-- ============================================
-- This migration adds the instructor_id column and related fields
-- to enable instructor assignment and course management.
--
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/vcifolmgcwgiaptnecdc
-- 2. Navigate to: SQL Editor (left sidebar)
-- 3. Click "New Query"
-- 4. Copy and paste this entire file
-- 5. Click "Run" or press Ctrl+Enter
-- ============================================

-- Add instructor_id column to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES public.profiles(id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'courses' 
  AND column_name = 'instructor_id';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! The instructor_id column has been added to the courses table.';
END $$;
