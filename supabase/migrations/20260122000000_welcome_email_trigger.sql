-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create a function to handle new user welcome emails
-- This function will be triggered when a new profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS TRIGGER AS $$
DECLARE
  response_status INT;
BEGIN
  -- Only send email if the user has an email address
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RETURN NEW;
  END IF;

  -- Call the send-welcome-email Edge Function using pg_net
  -- Using the Supabase project URL and anon key for authentication
  PERFORM
    net.http_post(
      url := 'https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3hpY2p5bnV4c25pamhtdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NTU3MjAsImV4cCI6MjA0ODQzMTcyMH0.Qb_0YWkLxOLqXJQpxPwYjOPjlJMqFJlnrMHQhCMWOvw'
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'profiles',
        'schema', 'public',
        'record', row_to_json(NEW)
      ),
      timeout_milliseconds := 5000
    );
    
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't block the profile creation if email fails
  -- Just log the error and continue
  RAISE WARNING 'Failed to send welcome email trigger: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on profiles table
-- This triggers AFTER a new profile is inserted
DROP TRIGGER IF EXISTS on_profile_created_send_welcome ON public.profiles;

CREATE TRIGGER on_profile_created_send_welcome
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_welcome();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON FUNCTION public.handle_new_user_welcome() TO postgres, anon, authenticated, service_role;

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user_welcome() IS 'Sends welcome email to new users via Brevo when a profile is created';
COMMENT ON TRIGGER on_profile_created_send_welcome ON public.profiles IS 'Triggers welcome email when a new user profile is created';
