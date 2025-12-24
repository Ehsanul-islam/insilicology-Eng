-- ============================================
-- Migration: Create upcoming_programs table
-- ============================================
-- This migration creates the upcoming_programs table for managing
-- upcoming program cards displayed in the hero section.
--
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to: SQL Editor (left sidebar)
-- 3. Click "New Query"
-- 4. Copy and paste this entire file
-- 5. Click "Run" or press Ctrl+Enter
-- ============================================

-- Create ENUM for program status
CREATE TYPE public.program_status AS ENUM ('draft', 'published', 'archived');

-- Create upcoming_programs table
CREATE TABLE IF NOT EXISTS public.upcoming_programs (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_upcoming_programs_status ON public.upcoming_programs(status);
CREATE INDEX IF NOT EXISTS idx_upcoming_programs_display_order ON public.upcoming_programs(display_order);
CREATE INDEX IF NOT EXISTS idx_upcoming_programs_start_date ON public.upcoming_programs(start_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_upcoming_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_upcoming_programs_updated_at
  BEFORE UPDATE ON public.upcoming_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_upcoming_programs_updated_at();

-- Enable Row Level Security
ALTER TABLE public.upcoming_programs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can read published programs
CREATE POLICY "Public can view published programs"
  ON public.upcoming_programs
  FOR SELECT
  USING (status = 'published');

-- RLS Policy: Admins can do everything
CREATE POLICY "Admins can manage all programs"
  ON public.upcoming_programs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! The upcoming_programs table has been created with RLS policies.';
END $$;

