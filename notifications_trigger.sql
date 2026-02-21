-- ============================================================
-- STEP 2: Create trigger function + attach trigger
-- Run this AFTER notifications_migration.sql
-- ============================================================

CREATE OR REPLACE FUNCTION public.notify_enrolled_students_on_live_session()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_course_title TEXT;
  v_formatted_date TEXT;
  v_formatted_time TEXT;
  v_enrollment RECORD;
BEGIN
  -- 1. Look up course title
  SELECT title INTO v_course_title
  FROM public.courses
  WHERE id = NEW.course_id;

  -- 2. Format the date (e.g. "March 5th, 2025")
  v_formatted_date := TO_CHAR(NEW.scheduled_date::DATE, 'FMMonth FMDDth, YYYY');

  -- 3. Format the time (e.g. "09:00 AM")
  --    IMPORTANT: start_time is a TIME column — use TO_CHAR() directly,
  --    never wrap in TO_TIMESTAMP() which only accepts TEXT.
  v_formatted_time := TO_CHAR(NEW.start_time, 'FMHH12:MI AM');

  -- 4. Loop over all non-cancelled, non-completed enrollments for this course
  --    Include 'pending' enrollments — pending students can see their dashboard.
  FOR v_enrollment IN
    SELECT user_id
    FROM public.enrollments
    WHERE course_id = NEW.course_id
      AND status NOT IN ('cancelled', 'completed')
  LOOP
    -- 5. Insert one notification per enrolled user
    INSERT INTO public.notifications (
      user_id,
      course_id,
      type,
      title,
      message,
      reference_id,
      is_read,
      created_at
    ) VALUES (
      v_enrollment.user_id,
      NEW.course_id,
      'live_session',
      'New Live Session: ' || NEW.title,
      'A new class has been scheduled for ' || v_course_title ||
        ' on ' || v_formatted_date ||
        ' at ' || v_formatted_time || '.',
      NEW.id,
      FALSE,
      NOW()
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Attach trigger to live_sessions table
DROP TRIGGER IF EXISTS on_live_session_created ON public.live_sessions;

CREATE TRIGGER on_live_session_created
  AFTER INSERT ON public.live_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_enrolled_students_on_live_session();
