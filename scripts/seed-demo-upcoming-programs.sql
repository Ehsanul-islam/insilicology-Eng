-- ============================================================
-- DEMO UPCOMING PROGRAMS SEED SCRIPT
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================
-- This script creates 4 demo upcoming programs for testing
-- Make sure the upcoming_programs table exists first by running
-- the migration: 20251224183335_create_upcoming_programs.sql
-- ============================================================

-- First, ensure the table and enum exist
DO $$ 
BEGIN
  -- Create enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'program_status') THEN
    CREATE TYPE public.program_status AS ENUM ('draft', 'published', 'archived');
  END IF;
  
  -- Create table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upcoming_programs') THEN
    CREATE TABLE public.upcoming_programs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      start_date DATE NOT NULL,
      registration_link TEXT NOT NULL,
      status program_status DEFAULT 'draft',
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Clear existing demo data (optional - uncomment to clear)
-- DELETE FROM public.upcoming_programs WHERE title IN (
--   'Advanced Bioinformatics Workshop',
--   'Genomics Data Analysis Bootcamp',
--   'Machine Learning for Life Sciences',
--   'Research Publication Masterclass'
-- );

-- Insert 4 demo upcoming programs
INSERT INTO public.upcoming_programs (
  title,
  image_url,
  start_date,
  registration_link,
  status,
  display_order
) VALUES
  (
    'Advanced Bioinformatics Workshop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    CURRENT_DATE + INTERVAL '30 days',
    '/courses',
    'published',
    1
  ),
  (
    'Genomics Data Analysis Bootcamp',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    CURRENT_DATE + INTERVAL '45 days',
    '/courses',
    'published',
    2
  ),
  (
    'Machine Learning for Life Sciences',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    CURRENT_DATE + INTERVAL '60 days',
    '/courses',
    'published',
    3
  ),
  (
    'Research Publication Masterclass',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    CURRENT_DATE + INTERVAL '75 days',
    '/courses',
    'published',
    4
  )
ON CONFLICT DO NOTHING;

-- Verify the insert
SELECT 
  id,
  title,
  start_date,
  status,
  display_order,
  created_at
FROM public.upcoming_programs
WHERE status = 'published'
ORDER BY display_order, start_date;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Demo upcoming programs created successfully!';
  RAISE NOTICE 'You can now view them on the homepage hero section.';
END $$;

