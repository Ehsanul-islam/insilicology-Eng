-- Add enrollment form fields and payment methods to courses
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS enrollment_form_fields jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS payment_methods jsonb DEFAULT '["bank_transfer", "mobile_payment"]'::jsonb,
ADD COLUMN IF NOT EXISTS payment_instructions text;

-- Add payment details to enrollments
ALTER TABLE public.enrollments
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS custom_form_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES public.profiles(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_status ON public.enrollments(payment_status);