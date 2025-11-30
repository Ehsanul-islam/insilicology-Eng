-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-posters', 'course-posters', true),
  ('avatars', 'avatars', true),
  ('course-resources', 'course-resources', false),
  ('portfolio-images', 'portfolio-images', true),
  ('blog-images', 'blog-images', true),
  ('resumes', 'resumes', false),
  ('payment-screenshots', 'payment-screenshots', false);

-- RLS Policies for course-posters bucket (public)
CREATE POLICY "Course posters are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-posters');

CREATE POLICY "Instructors and admins can upload course posters"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-posters' AND
  (public.has_role(auth.uid(), 'instructor'::public.app_role) OR 
   public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Instructors and admins can update course posters"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-posters' AND
  (public.has_role(auth.uid(), 'instructor'::public.app_role) OR 
   public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Instructors and admins can delete course posters"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-posters' AND
  (public.has_role(auth.uid(), 'instructor'::public.app_role) OR 
   public.has_role(auth.uid(), 'admin'::public.app_role))
);

-- RLS Policies for avatars bucket (public)
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policies for course-resources bucket (private)
CREATE POLICY "Enrolled users can view course resources"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-resources' AND
  (EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid() 
      AND status = 'active'::public.enrollment_status
  ) OR 
  public.has_role(auth.uid(), 'instructor'::public.app_role) OR 
  public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Instructors and admins can upload course resources"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-resources' AND
  (public.has_role(auth.uid(), 'instructor'::public.app_role) OR 
   public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Instructors and admins can update course resources"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-resources' AND
  (public.has_role(auth.uid(), 'instructor'::public.app_role) OR 
   public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Instructors and admins can delete course resources"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-resources' AND
  (public.has_role(auth.uid(), 'instructor'::public.app_role) OR 
   public.has_role(auth.uid(), 'admin'::public.app_role))
);

-- RLS Policies for portfolio-images bucket (public)
CREATE POLICY "Portfolio images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Admins can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- RLS Policies for blog-images bucket (public)
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- RLS Policies for resumes bucket (private)
CREATE POLICY "Admins can view resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

-- RLS Policies for payment-screenshots bucket (private)
CREATE POLICY "Admins can view payment screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-screenshots' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Users can upload their own payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-screenshots' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-screenshots' AND
  auth.uid()::text = (storage.foldername(name))[1]
);