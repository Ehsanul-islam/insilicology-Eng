-- ============================================
-- ENROLLMENT EMAILS - DIRECT BREVO API CALLS
-- ============================================
-- This bypasses the Edge Function 404 issue by calling Brevo API directly from triggers

-- Function: Send Enrollment Submitted Email
CREATE OR REPLACE FUNCTION public.send_enrollment_submitted_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  user_email text;
  user_name text;
  course_title text;
  html_content text;
BEGIN
  -- Only send for new pending enrollments
  IF NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending') THEN
    
    -- Get enrollment details
    SELECT 
      p.email,
      COALESCE(p.full_name, split_part(p.email, '@', 1)),
      c.title
    INTO user_email, user_name, course_title
    FROM profiles p
    JOIN courses c ON c.id = NEW.course_id
    WHERE p.id = NEW.user_id;
    
    -- Build HTML email
    html_content := format('<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px;"><div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;"><h1 style="color: white; margin: 0;">Enrollment Submitted ✓</h1></div><div style="padding: 30px;"><p>Hi <strong>%s</strong>,</p><p>Thank you for your interest in <strong>%s</strong>!</p><p>We have received your enrollment request and payment information. Our team will review your submission within <strong>24-48 hours</strong>.</p><div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"><p style="margin: 0 0 10px 0;"><strong>What happens next?</strong></p><ul style="margin: 0; padding-left: 20px;"><li>We''ll verify your payment information</li><li>You''ll receive a confirmation email once approved</li><li>You''ll get instant access to the course dashboard</li></ul></div><p>If you have any questions, please contact us at noreply@insilicology.com.</p><p>Best regards,<br><strong>The Zymios Team</strong></p></div><div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;"><p style="margin: 0; font-size: 12px; color: #666;">© 2026 Zymios. All rights reserved.</p></div></div></body></html>', user_name, course_title);
    
    -- Call Brevo API
    SELECT net.http_post(
      url := 'https://api.brevo.com/v3/smtp/email',
      headers := '{"api-key": "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", "Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'sender', json_build_object('name', 'insilicology', 'email', 'noreply@insilicology.com'),
        'to', json_build_array(json_build_object('email', user_email, 'name', user_name)),
        'subject', 'Enrollment Submitted - ' || course_title,
        'htmlContent', html_content
      )::jsonb
    ) INTO request_id;
    
    RAISE LOG 'Enrollment submitted email sent: %', request_id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error sending enrollment email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Function: Send Enrollment Approved Email
CREATE OR REPLACE FUNCTION public.send_enrollment_approved_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  user_email text;
  user_name text;
  course_title text;
  html_content text;
BEGIN
  -- Only send when status changes to active
  IF NEW.status = 'active' AND OLD.status != 'active' THEN
    
    -- Get enrollment details
    SELECT 
      p.email,
      COALESCE(p.full_name, split_part(p.email, '@', 1)),
      c.title
    INTO user_email, user_name, course_title
    FROM profiles p
    JOIN courses c ON c.id = NEW.course_id
    WHERE p.id = NEW.user_id;
    
    -- Build HTML email
    html_content := format('<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px;"><div style="background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;"><h1 style="color: white; margin: 0;">Enrollment Approved! 🎉</h1></div><div style="padding: 30px;"><p>Hi <strong>%s</strong>,</p><p style="font-size: 18px; font-weight: 600;">Congratulations! Your enrollment in <strong>%s</strong> has been approved! 🎊</p><p>You now have full access to all course materials, lessons, and resources. We''re excited to have you on this learning journey!</p><div style="text-align: center; margin: 30px 0;"><a href="https://insilicology.com/dashboard" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Go to Dashboard</a></div><div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;"><p style="margin: 0 0 10px 0;"><strong>Ready to get started?</strong></p><ul style="margin: 0; padding-left: 20px;"><li>Access your course dashboard</li><li>Start with the first lesson</li><li>Join our community discussions</li><li>Track your progress</li></ul></div><p>Happy learning!<br><strong>The Zymios Team</strong></p></div><div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;"><p style="margin: 0; font-size: 12px; color: #666;">© 2026 Zymios. All rights reserved.</p></div></div></body></html>', user_name, course_title);
    
    -- Call Brevo API
    SELECT net.http_post(
      url := 'https://api.brevo.com/v3/smtp/email',
      headers := '{"api-key": "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", "Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'sender', json_build_object('name', 'insilicology', 'email', 'noreply@insilicology.com'),
        'to', json_build_array(json_build_object('email', user_email, 'name', user_name)),
        'subject', 'Enrollment Approved - ' || course_title || ' 🎉',
        'htmlContent', html_content
      )::jsonb
    ) INTO request_id;
    
    RAISE LOG 'Enrollment approved email sent: %', request_id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error sending approval email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Function: Send Enrollment Rejected Email
CREATE OR REPLACE FUNCTION public.send_enrollment_rejected_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  user_email text;
  user_name text;
  course_title text;
  course_slug text;
  rejection_reason text;
  html_content text;
BEGIN
  -- Only send when status changes to cancelled
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    
    -- Get enrollment details
    SELECT 
      p.email,
      COALESCE(p.full_name, split_part(p.email, '@', 1)),
      c.title,
      c.slug,
      COALESCE(NEW.rejection_reason, 'Please contact support for more details.')
    INTO user_email, user_name, course_title, course_slug, rejection_reason
    FROM profiles p
    JOIN courses c ON c.id = NEW.course_id
    WHERE p.id = NEW.user_id;
    
    -- Build HTML email
    html_content := format('<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;"><div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px;"><div style="background: linear-gradient(135deg, #f59e0b 0%%, #d97706 100%%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;"><h1 style="color: white; margin: 0;">Enrollment Update</h1></div><div style="padding: 30px;"><p>Hi <strong>%s</strong>,</p><p>Thank you for your interest in <strong>%s</strong>.</p><p>Unfortunately, we couldn''t approve your enrollment at this time. Here''s why:</p><div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;"><p style="margin: 0;"><strong>Reason:</strong><br>%s</p></div><p><strong>What you can do:</strong></p><ul style="padding-left: 20px;"><li>Review the reason above and make necessary corrections</li><li>Contact us at noreply@insilicology.com for clarification</li><li>Submit a new enrollment request with updated information</li></ul><div style="text-align: center; margin: 30px 0;"><a href="https://insilicology.com/courses/%s" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #f59e0b 0%%, #d97706 100%%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Try Again</a></div><p>We''re here to help! If you have any questions or need assistance, please don''t hesitate to reach out.</p><p>Best regards,<br><strong>The Zymios Team</strong></p></div><div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;"><p style="margin: 0; font-size: 12px; color: #666;">© 2026 Zymios. All rights reserved.</p></div></div></body></html>', user_name, course_title, rejection_reason, course_slug);
    
    -- Call Brevo API
    SELECT net.http_post(
      url := 'https://api.brevo.com/v3/smtp/email',
      headers := '{"api-key": "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", "Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'sender', json_build_object('name', 'insilicology', 'email', 'noreply@insilicology.com'),
        'to', json_build_array(json_build_object('email', user_email, 'name', user_name)),
        'subject', 'Enrollment Update - ' || course_title,
        'htmlContent', html_content
      )::jsonb
    ) INTO request_id;
    
    RAISE LOG 'Enrollment rejected email sent: %', request_id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error sending rejection email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop old triggers
DROP TRIGGER IF EXISTS on_enrollment_submitted ON enrollments;
DROP TRIGGER IF EXISTS on_enrollment_status_change ON enrollments;

-- Create new triggers
CREATE TRIGGER on_enrollment_submitted
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.send_enrollment_submitted_email();

CREATE TRIGGER on_enrollment_approved
  AFTER UPDATE ON enrollments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'active')
  EXECUTE FUNCTION public.send_enrollment_approved_email();

CREATE TRIGGER on_enrollment_rejected
  AFTER UPDATE ON enrollments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'cancelled')
  EXECUTE FUNCTION public.send_enrollment_rejected_email();

-- Verification
SELECT 
    t.tgname as trigger_name,
    t.tgrelid::regclass as table_name,
    t.tgenabled as enabled
FROM pg_trigger t
WHERE t.tgrelid::regclass::text = 'enrollments'
AND t.tgname LIKE 'on_enrollment%'
ORDER BY t.tgname;
