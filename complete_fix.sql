-- ============================================
-- PART 1: Enrollment Email Triggers
-- ============================================

-- Function to send enrollment submitted email
CREATE OR REPLACE FUNCTION public.handle_enrollment_submitted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Only send email for new pending enrollments
  IF NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending') THEN
    SELECT net.http_post(
      url := 'https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-enrollment-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3hpY2p5bnV4c25pamhtdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTE4NTAsImV4cCI6MjA4MTg2Nzg1MH0.-kGi0ojoEXtPNJP1x5Aj1KBE0TVUpoKhTzR1LGeslCI"}'::jsonb,
      body := json_build_object(
        'enrollmentId', NEW.id,
        'type', 'submitted'
      )::jsonb
    ) INTO request_id;
    
    RAISE LOG 'Enrollment submitted email request sent: %', request_id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error sending enrollment email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Function to send enrollment status change emails (approved/rejected)
CREATE OR REPLACE FUNCTION public.handle_enrollment_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  email_type text;
BEGIN
  -- Determine email type based on status change
  IF NEW.status = 'active' AND OLD.status != 'active' THEN
    email_type := 'approved';
  ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    email_type := 'rejected';
  ELSE
    RETURN NEW; -- No email needed
  END IF;
  
  -- Send email
  SELECT net.http_post(
    url := 'https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-enrollment-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3hpY2p5bnV4c25pamhtdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTE4NTAsImV4cCI6MjA4MTg2Nzg1MH0.-kGi0ojoEXtPNJP1x5Aj1KBE0TVUpoKhTzR1LGeslCI"}'::jsonb,
    body := json_build_object(
      'enrollmentId', NEW.id,
      'type', email_type
    )::jsonb
  ) INTO request_id;
  
  RAISE LOG 'Enrollment % email request sent: %', email_type, request_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error sending enrollment status email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS on_enrollment_submitted ON enrollments;
CREATE TRIGGER on_enrollment_submitted
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_enrollment_submitted();

DROP TRIGGER IF EXISTS on_enrollment_status_change ON enrollments;
CREATE TRIGGER on_enrollment_status_change
  AFTER UPDATE ON enrollments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.handle_enrollment_status_change();

-- Add comments
COMMENT ON FUNCTION public.handle_enrollment_submitted() IS 
'Automatically sends enrollment submitted email when new enrollment is created';

COMMENT ON FUNCTION public.handle_enrollment_status_change() IS 
'Automatically sends approval/rejection emails when enrollment status changes';

-- ============================================
-- PART 2: Fix Coupon Usages Table
-- ============================================

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    coupon_code TEXT NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, coupon_code)
);

-- Enable RLS
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own coupon usages" ON public.coupon_usages;
DROP POLICY IF EXISTS "Users can insert their own coupon usages" ON public.coupon_usages;
DROP POLICY IF EXISTS "Users can read own coupon usage" ON public.coupon_usages;
DROP POLICY IF EXISTS "Users can insert own coupon usage" ON public.coupon_usages;

-- Create RLS policies
CREATE POLICY "Users can view their own coupon usages"
    ON public.coupon_usages
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usages"
    ON public.coupon_usages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT ON public.coupon_usages TO authenticated;
GRANT SELECT ON public.coupon_usages TO anon;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user_id ON public.coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_code ON public.coupon_usages(coupon_code);

COMMENT ON TABLE public.coupon_usages IS 'Tracks which users have used which coupons';

-- ============================================
-- Verification Queries
-- ============================================

-- Check if triggers were created
SELECT 
    t.tgname as trigger_name,
    t.tgrelid::regclass as table_name,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname IN ('on_enrollment_submitted', 'on_enrollment_status_change')
ORDER BY t.tgname;

-- Check if coupon_usages table exists
SELECT 
    tablename,
    schemaname
FROM pg_tables 
WHERE tablename = 'coupon_usages';

-- Check RLS policies on coupon_usages
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'coupon_usages';
