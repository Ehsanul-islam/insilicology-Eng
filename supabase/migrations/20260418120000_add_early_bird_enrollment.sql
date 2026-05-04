-- Tracks whether the student enrolled during the Early Bird window (used for Early Bird–only curriculum modules).
ALTER TABLE public.enrollments
ADD COLUMN IF NOT EXISTS early_bird_enrollment BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.enrollments.early_bird_enrollment IS 'True if enrollment was submitted while Early Bird pricing/slots were still available.';
