-- ============================================
-- DELETE ALL STORAGE BUCKETS AND POLICIES
-- Run this BEFORE running STORAGE_BUCKETS_SETUP.sql
-- ============================================

-- Drop all storage policies on objects table
DROP POLICY IF EXISTS "Course posters are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Instructors and admins can upload course posters" ON storage.objects;
DROP POLICY IF EXISTS "Instructors and admins can update course posters" ON storage.objects;
DROP POLICY IF EXISTS "Instructors and admins can delete course posters" ON storage.objects;

DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

DROP POLICY IF EXISTS "Enrolled users can view course resources" ON storage.objects;
DROP POLICY IF EXISTS "Instructors and admins can upload course resources" ON storage.objects;
DROP POLICY IF EXISTS "Instructors and admins can update course resources" ON storage.objects;
DROP POLICY IF EXISTS "Instructors and admins can delete course resources" ON storage.objects;

DROP POLICY IF EXISTS "Portfolio images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;

DROP POLICY IF EXISTS "Admins can view payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment screenshots" ON storage.objects;

-- Delete all buckets (this will also delete all files in them!)
DELETE FROM storage.buckets WHERE id = 'course-posters';
DELETE FROM storage.buckets WHERE id = 'avatars';
DELETE FROM storage.buckets WHERE id = 'course-resources';
DELETE FROM storage.buckets WHERE id = 'portfolio-images';
DELETE FROM storage.buckets WHERE id = 'blog-images';
DELETE FROM storage.buckets WHERE id = 'resumes';
DELETE FROM storage.buckets WHERE id = 'payment-screenshots';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All storage buckets and policies have been deleted!';
  RAISE NOTICE 'You can now run STORAGE_BUCKETS_SETUP.sql';
END $$;
