-- Add instructor_id column to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES public.profiles(id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);

-- Update RLS policies to fallback to new column if needed (although existing policies seemed to reference it via role checks, they might need adjustment if they start using this col)
-- The existing policies were:
-- CREATE POLICY "Instructors can create courses" ON public.courses FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
-- This implies they don't strictly *need* the column for permission, but the APPLICATION code is filtering by it: .eq('instructor_id', user.id)

-- Let's enable RLS for this new column explicitly if needed, but the table already has RLS.
