-- ============================================================
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR
-- This will create 4 demo programs that will show immediately
-- ============================================================

-- Make sure table exists (run migration first if needed)
-- Then run this INSERT statement:

INSERT INTO public.upcoming_programs (
  title,
  image_url,
  start_date,
  registration_link,
  status,
  display_order
) VALUES
  (
    'Advanced Bioinformatics Workshop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    CURRENT_DATE + 30,
    '/courses',
    'published',
    1
  ),
  (
    'Genomics Data Analysis Bootcamp',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    CURRENT_DATE + 45,
    '/courses',
    'published',
    2
  ),
  (
    'Machine Learning for Life Sciences',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    CURRENT_DATE + 60,
    '/courses',
    'published',
    3
  ),
  (
    'Research Publication Masterclass',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    CURRENT_DATE + 75,
    '/courses',
    'published',
    4
  );

-- Check if they were inserted
SELECT COUNT(*) as total_programs FROM public.upcoming_programs WHERE status = 'published';

