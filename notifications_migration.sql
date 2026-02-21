-- ============================================================
-- STEP 1: Create notifications table
-- Run this first in the Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id    UUID        REFERENCES public.courses(id) ON DELETE CASCADE,
  type         TEXT        NOT NULL DEFAULT 'live_session',
  title        TEXT        NOT NULL,
  message      TEXT        NOT NULL,
  reference_id UUID,
  is_read      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON public.notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications (user_id, is_read)
  WHERE is_read = FALSE;

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: students can read their own notifications
CREATE POLICY "Students can read own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: students can update their own notifications (mark as read)
CREATE POLICY "Students can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Note: admin SELECT policy omitted — has_role() does not exist in this project.
