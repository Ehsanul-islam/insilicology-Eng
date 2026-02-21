-- ============================================================
-- Archived Course Guard — CORRECTED
-- Enrolled students retain access to archived course content.
-- Non-enrolled users are blocked from archived courses.
--
-- Run this in Supabase SQL Editor.
-- It drops the previous policies and replaces them.
-- ============================================================

-- ── lessons ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Block lessons from archived courses" ON public.lessons;

CREATE POLICY "Lessons: enrolled students retain access on archived courses"
  ON public.lessons
  FOR SELECT
  USING (
    -- Allow if course is not archived (normal published/draft access)
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = lessons.course_id
        AND courses.status != 'archived'
    )
    OR
    -- Allow if user is actively enrolled, even when course is archived
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = lessons.course_id
        AND enrollments.user_id  = auth.uid()
        AND enrollments.status   = 'active'
    )
  );

-- ── course_resources ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Block resources from archived courses" ON public.course_resources;

CREATE POLICY "Resources: enrolled students retain access on archived courses"
  ON public.course_resources
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_resources.course_id
        AND courses.status != 'archived'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = course_resources.course_id
        AND enrollments.user_id  = auth.uid()
        AND enrollments.status   = 'active'
    )
  );

-- Verify RLS is still on
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('lessons', 'course_resources');
