-- ============================================
-- Migration: Fix RLS policies for upcoming_programs
-- ============================================

-- Drop old policies to replace them
DROP POLICY IF EXISTS "Admins can manage all programs" ON public.upcoming_programs;
DROP POLICY IF EXISTS "Public can view published programs" ON public.upcoming_programs;

-- RLS Policy: Public can read published programs
CREATE POLICY "Public can view published programs"
  ON public.upcoming_programs
  FOR SELECT
  USING (status = 'published');

-- RLS Policy: Admins can do everything
-- Using security definer function has_role to avoid recursion and ensure consistency
CREATE POLICY "Admins can manage upcoming programs"
  ON public.upcoming_programs
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies for upcoming_programs have been updated successfully.';
END $$;
