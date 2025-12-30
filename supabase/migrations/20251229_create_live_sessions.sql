-- ============================================
-- LIVE SESSION MANAGEMENT SYSTEM
-- Migration: Create live_sessions, session_qa, and notification_preferences tables
-- ============================================

-- ============================================
-- TABLE 1: live_sessions
-- ============================================
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Session Details
  title TEXT NOT NULL,
  description TEXT,
  session_number INTEGER,
  
  -- Scheduling with Timezone Support
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
  duration_minutes INTEGER,
  
  -- Recurring Session Support
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'biweekly', 'monthly', 'custom')),
  recurrence_end_date DATE,
  parent_session_id UUID REFERENCES public.live_sessions(id) ON DELETE SET NULL,
  
  -- Meeting Information
  meeting_platform TEXT CHECK (meeting_platform IN ('zoom', 'google_meet', 'microsoft_teams', 'other')),
  meeting_link TEXT,
  meeting_id TEXT,
  meeting_passcode TEXT,
  
  -- Recording Management (Google Drive)
  recording_drive_link TEXT,
  recording_added_at TIMESTAMPTZ,
  recording_added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Notification Settings
  notification_sent BOOLEAN DEFAULT FALSE,
  reminder_24h_sent BOOLEAN DEFAULT FALSE,
  reminder_1h_sent BOOLEAN DEFAULT FALSE,
  
  -- Status & Metadata
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'ongoing', 'completed', 'cancelled')),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ============================================
-- CONSTRAINTS FOR live_sessions
-- ============================================

-- Ensure end_time is after start_time
ALTER TABLE public.live_sessions 
  ADD CONSTRAINT check_time_order 
  CHECK (end_time > start_time);

-- Ensure scheduled_date is not in the past (allow today)
ALTER TABLE public.live_sessions 
  ADD CONSTRAINT check_future_date 
  CHECK (scheduled_date >= CURRENT_DATE);

-- Ensure meeting link is provided for scheduled/ongoing sessions
ALTER TABLE public.live_sessions 
  ADD CONSTRAINT check_meeting_link 
  CHECK (
    status IN ('draft', 'cancelled') OR 
    (status IN ('scheduled', 'ongoing', 'completed') AND meeting_link IS NOT NULL)
  );

-- Prevent recording link for non-completed sessions
ALTER TABLE public.live_sessions 
  ADD CONSTRAINT check_recording_status 
  CHECK (
    recording_drive_link IS NULL OR 
    status = 'completed'
  );

-- ============================================
-- INDEXES FOR live_sessions
-- ============================================
CREATE INDEX idx_live_sessions_course_id ON public.live_sessions(course_id);
CREATE INDEX idx_live_sessions_instructor_id ON public.live_sessions(instructor_id);
CREATE INDEX idx_live_sessions_scheduled_date ON public.live_sessions(scheduled_date);
CREATE INDEX idx_live_sessions_status ON public.live_sessions(status);
CREATE INDEX idx_live_sessions_parent_session ON public.live_sessions(parent_session_id);

-- Prevent overlapping sessions for same instructor (excluding cancelled sessions)
CREATE UNIQUE INDEX idx_no_instructor_overlap ON public.live_sessions (
  instructor_id, 
  scheduled_date, 
  start_time
) WHERE status != 'cancelled' AND instructor_id IS NOT NULL;

-- ============================================
-- TABLE 2: session_qa
-- ============================================
CREATE TABLE public.session_qa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.live_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Question/Feedback
  question_type TEXT DEFAULT 'question' CHECK (question_type IN ('question', 'feedback', 'comment')),
  content TEXT NOT NULL,
  
  -- Instructor Response
  instructor_response TEXT,
  responded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  responded_at TIMESTAMPTZ,
  
  -- Status
  is_answered BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR session_qa
-- ============================================
CREATE INDEX idx_session_qa_session_id ON public.session_qa(session_id);
CREATE INDEX idx_session_qa_user_id ON public.session_qa(user_id);
CREATE INDEX idx_session_qa_is_answered ON public.session_qa(is_answered);
CREATE INDEX idx_session_qa_is_pinned ON public.session_qa(is_pinned);

-- ============================================
-- TABLE 3: notification_preferences
-- ============================================
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification Channels
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  
  -- Timing Preferences
  reminder_24h_before BOOLEAN DEFAULT TRUE,
  reminder_1h_before BOOLEAN DEFAULT TRUE,
  reminder_15m_before BOOLEAN DEFAULT FALSE,
  
  -- Notification Types
  session_created BOOLEAN DEFAULT TRUE,
  session_updated BOOLEAN DEFAULT TRUE,
  session_cancelled BOOLEAN DEFAULT TRUE,
  new_qa_response BOOLEAN DEFAULT TRUE,
  recording_available BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- RLS POLICIES FOR live_sessions
-- ============================================
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- Students can view sessions for courses they're enrolled in
CREATE POLICY "Students can view sessions for enrolled courses" 
  ON public.live_sessions FOR SELECT 
  USING (
    is_active = true AND (
      EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE enrollments.user_id = auth.uid() 
          AND enrollments.course_id = live_sessions.course_id 
          AND enrollments.status = 'active'
      )
      OR public.has_role(auth.uid(), 'instructor')
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- Instructors and admins can create sessions
CREATE POLICY "Instructors can create sessions" 
  ON public.live_sessions FOR INSERT 
  WITH CHECK (
    public.has_role(auth.uid(), 'instructor') 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Instructors can update their own sessions, admins can update all
CREATE POLICY "Instructors can update own sessions" 
  ON public.live_sessions FOR UPDATE 
  USING (
    instructor_id = auth.uid() 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Only admins can delete sessions
CREATE POLICY "Admins can delete sessions" 
  ON public.live_sessions FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES FOR session_qa
-- ============================================
ALTER TABLE public.session_qa ENABLE ROW LEVEL SECURITY;

-- Students can view Q&A for sessions they can access
CREATE POLICY "Students can view session QA" 
  ON public.session_qa FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.live_sessions ls
      JOIN public.enrollments e ON e.course_id = ls.course_id
      WHERE ls.id = session_qa.session_id
        AND e.user_id = auth.uid()
        AND e.status = 'active'
    )
    OR public.has_role(auth.uid(), 'instructor')
    OR public.has_role(auth.uid(), 'admin')
  );

-- Enrolled students can post questions
CREATE POLICY "Enrolled students can post questions" 
  ON public.session_qa FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.live_sessions ls
      JOIN public.enrollments e ON e.course_id = ls.course_id
      WHERE ls.id = session_qa.session_id
        AND e.user_id = auth.uid()
        AND e.status = 'active'
    )
  );

-- Users can update their own questions, instructors/admins can update any
CREATE POLICY "Users can update own questions" 
  ON public.session_qa FOR UPDATE 
  USING (
    auth.uid() = user_id 
    OR public.has_role(auth.uid(), 'instructor')
    OR public.has_role(auth.uid(), 'admin')
  );

-- Users can delete their own questions, admins can delete any
CREATE POLICY "Users can delete own questions" 
  ON public.session_qa FOR DELETE 
  USING (
    auth.uid() = user_id 
    OR public.has_role(auth.uid(), 'admin')
  );

-- ============================================
-- RLS POLICIES FOR notification_preferences
-- ============================================
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences" 
  ON public.notification_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences" 
  ON public.notification_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences" 
  ON public.notification_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for updated_at on live_sessions
CREATE TRIGGER set_updated_at 
  BEFORE UPDATE ON public.live_sessions 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for updated_at on session_qa
CREATE TRIGGER set_updated_at 
  BEFORE UPDATE ON public.session_qa 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for updated_at on notification_preferences
CREATE TRIGGER set_updated_at 
  BEFORE UPDATE ON public.notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Live Session Management tables created successfully!';
  RAISE NOTICE 'Tables: live_sessions, session_qa, notification_preferences';
  RAISE NOTICE 'All constraints, indexes, and RLS policies applied.';
  RAISE NOTICE '============================================';
END $$;
