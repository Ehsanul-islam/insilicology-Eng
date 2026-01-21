-- Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to send welcome email when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  user_email text;
  user_name text;
BEGIN
  -- Get user email and name
  user_email := NEW.email;
  user_name := COALESCE(NEW.full_name, split_part(user_email, '@', 1));

  -- Make async HTTP request to Edge Function
  -- IMPORTANT: Replace PROJECT_REF and ANON_KEY with your actual values
  SELECT net.http_post(
    url := 'https://hmgxicjynuxsnijhmvth.supabase.co/functions/v1/send-welcome-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3hpY2p5bnV4c25pamhtdnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTE4NTAsImV4cCI6MjA4MTg2Nzg1MH0.-kGi0ojoEXtPNJP1x5Aj1KBE0TVUpoKhTzR1LGeslCI"}'::jsonb,
    body := json_build_object(
      'email', user_email,
      'name', user_name
    )::jsonb
  ) INTO request_id;

  -- Log the request (optional, for debugging)
  RAISE LOG 'Welcome email request sent for user: %, request_id: %', user_email, request_id;

  -- Always return NEW to allow the INSERT to proceed
  -- Even if the email fails, we don't want to block user signup
  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user signup
    RAISE LOG 'Error sending welcome email for user %: %', user_email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger that fires AFTER INSERT on profiles table
DROP TRIGGER IF EXISTS on_auth_user_created_welcome ON public.profiles;

CREATE TRIGGER on_auth_user_created_welcome
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_welcome();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION net.http_post TO postgres, anon, authenticated, service_role;

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user_welcome() IS 
'Automatically sends welcome email with WELCOME100 coupon when new user signs up. Uses pg_net to make async HTTP request to send-welcome-email Edge Function.';

COMMENT ON TRIGGER on_auth_user_created_welcome ON public.profiles IS 
'Triggers welcome email send when new user profile is created after signup.';
