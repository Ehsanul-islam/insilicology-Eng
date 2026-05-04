-- ============================================
-- STORAGE BUCKETS SETUP
-- insilicology LMS Platform
-- Run this AFTER the main schema has been set up
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-posters', 'course-posters', true),
  ('avatars', 'avatars', true),
  ('course-resources', 'course-resources', false),
  ('portfolio-images', 'portfolio-images', true),
  ('blog-images', 'blog-images', true),
  ('resumes', 'resumes', false),
  ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================

-- Course Posters (public)
CREATE POLICY "Course posters are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'course-posters');
CREATE POLICY "Instructors and admins can upload course posters" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course-posters' AND (public.has_role(auth.uid(), 'instructor'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));
CREATE POLICY "Instructors and admins can update course posters" ON storage.objects FOR UPDATE USING (bucket_id = 'course-posters' AND (public.has_role(auth.uid(), 'instructor'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));
CREATE POLICY "Instructors and admins can delete course posters" ON storage.objects FOR DELETE USING (bucket_id = 'course-posters' AND (public.has_role(auth.uid(), 'instructor'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

-- Avatars (public)
CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Course Resources (private)
CREATE POLICY "Enrolled users can view course resources" ON storage.objects FOR SELECT USING (bucket_id = 'course-resources' AND (EXISTS (SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND status = 'active'::public.enrollment_status) OR public.has_role(auth.uid(), 'instructor'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));
CREATE POLICY "Instructors and admins can upload course resources" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course-resources' AND (public.has_role(auth.uid(), 'instructor'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));
CREATE POLICY "Instructors and admins can update course resources" ON storage.objects FOR UPDATE USING (bucket_id = 'course-resources' AND (public.has_role(auth.uid(), 'instructor'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));
CREATE POLICY "Instructors and admins can delete course resources" ON storage.objects FOR DELETE USING (bucket_id = 'course-resources' AND (public.has_role(auth.uid(), 'instructor'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role)));

-- Portfolio Images (public)
CREATE POLICY "Portfolio images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Admins can upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update portfolio images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete portfolio images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Blog Images (public)
CREATE POLICY "Blog images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Admins can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update blog images" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete blog images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Resumes (private)
CREATE POLICY "Admins can view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- Payment Screenshots (private)
CREATE POLICY "Admins can view payment screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users can upload their own payment screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own payment screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Storage buckets and policies created successfully!';
END $$;
