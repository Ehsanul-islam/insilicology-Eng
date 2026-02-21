-- ============================================================
-- STEP 3: Backfill notifications for existing live sessions
-- Run this AFTER notifications_trigger.sql
-- Safe to run multiple times — NOT EXISTS prevents duplicates
-- ============================================================

-- NOTE: "Success. No rows returned" in the Supabase SQL Editor is NORMAL.
-- The editor shows the result of the last statement (the SELECT COUNT below),
-- not the INSERT. To verify, check: SELECT COUNT(*) FROM notifications;

INSERT INTO public.notifications (
  user_id,
  course_id,
  type,
  title,
  message,
  reference_id,
  is_read,
  created_at
)
SELECT
  e.user_id,
  ls.course_id,
  'live_session',
  'New Live Session: ' || ls.title,
  'A new class has been scheduled for ' || c.title ||
    ' on ' || TO_CHAR(ls.scheduled_date, 'FMMonth FMDDth, YYYY') ||
    ' at ' || TO_CHAR(ls.start_time, 'FMHH12:MI AM') || '.',
  ls.id,
  FALSE,
  NOW()
FROM public.live_sessions ls
JOIN public.courses c ON c.id = ls.course_id
JOIN public.enrollments e ON e.course_id = ls.course_id
WHERE e.status NOT IN ('cancelled', 'completed')
  AND ls.scheduled_date >= CURRENT_DATE
  AND ls.status IN ('scheduled', 'ongoing')
  AND NOT EXISTS (
    SELECT 1
    FROM public.notifications n
    WHERE n.user_id = e.user_id
      AND n.reference_id = ls.id
      AND n.type = 'live_session'
  );

-- Verify the insert (run separately or check this result):
SELECT COUNT(*) AS total_notifications FROM public.notifications;
