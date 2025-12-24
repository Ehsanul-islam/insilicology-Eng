-- ============================================
-- FIX UPCOMING_PROGRAMS RLS POLICIES
-- Remove duplicate policies and ensure proper INSERT/UPDATE permissions
-- ============================================

-- Drop all existing admin policies (we'll recreate them properly)
DROP POLICY IF EXISTS "Admins can manage all programs" ON public.upcoming_programs;
DROP POLICY IF EXISTS "Admins can manage upcoming programs" ON public.upcoming_programs;

-- Keep the public view policy (it's fine)
-- DROP POLICY IF EXISTS "Public can view published programs" ON public.upcoming_programs;

-- Create a single, proper admin policy with both USING and WITH CHECK
-- This ensures admins can SELECT, INSERT, UPDATE, and DELETE
CREATE POLICY "Admins can manage upcoming programs"
  ON public.upcoming_programs
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'upcoming_programs'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies for upcoming_programs have been fixed. Duplicate policies removed.';
END $$;

