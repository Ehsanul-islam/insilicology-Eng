-- ============================================================
-- QUICK INSERT: Demo Upcoming Programs
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- ============================================================

-- Insert 4 demo programs (will work even if some already exist)
INSERT INTO public.upcoming_programs (
  title,
  image_url,
  start_date,
  registration_link,
  status,
  display_order
) 
SELECT 
  'Advanced Bioinformatics Workshop',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  CURRENT_DATE + INTERVAL '30 days',
  '/courses',
  'published'::program_status,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.upcoming_programs WHERE title = 'Advanced Bioinformatics Workshop'
)

UNION ALL

SELECT 
  'Genomics Data Analysis Bootcamp',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  CURRENT_DATE + INTERVAL '45 days',
  '/courses',
  'published'::program_status,
  2
WHERE NOT EXISTS (
  SELECT 1 FROM public.upcoming_programs WHERE title = 'Genomics Data Analysis Bootcamp'
)

UNION ALL

SELECT 
  'Machine Learning for Life Sciences',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
  CURRENT_DATE + INTERVAL '60 days',
  '/courses',
  'published'::program_status,
  3
WHERE NOT EXISTS (
  SELECT 1 FROM public.upcoming_programs WHERE title = 'Machine Learning for Life Sciences'
)

UNION ALL

SELECT 
  'Research Publication Masterclass',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
  CURRENT_DATE + INTERVAL '75 days',
  '/courses',
  'published'::program_status,
  4
WHERE NOT EXISTS (
  SELECT 1 FROM public.upcoming_programs WHERE title = 'Research Publication Masterclass'
);

-- Verify the insert
SELECT 
  id,
  title,
  start_date,
  status,
  display_order
FROM public.upcoming_programs
WHERE status = 'published'
ORDER BY display_order;

-- Success message
SELECT 'Demo programs inserted successfully! Refresh your homepage to see them.' as message;

