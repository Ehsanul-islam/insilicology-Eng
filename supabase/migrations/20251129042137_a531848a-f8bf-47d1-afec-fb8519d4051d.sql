-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- USER_ROLES POLICIES
-- ============================================
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- COURSES POLICIES
-- ============================================
CREATE POLICY "Published courses are viewable by all" ON public.courses
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Instructors can view all courses" ON public.courses
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'instructor'));

CREATE POLICY "Admins can view all courses" ON public.courses
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can create courses" ON public.courses
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can update courses" ON public.courses
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses" ON public.courses
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- LESSONS POLICIES
-- ============================================
CREATE POLICY "Lessons viewable if course is published or user is enrolled" ON public.lessons
  FOR SELECT 
  USING (
    is_active = true AND (
      is_preview = true OR
      EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = lessons.course_id AND courses.status = 'published'
      ) OR
      EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE enrollments.user_id = auth.uid() 
        AND enrollments.course_id = lessons.course_id
        AND enrollments.status = 'active'
      ) OR
      public.has_role(auth.uid(), 'instructor') OR
      public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Instructors can create lessons" ON public.lessons
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can update lessons" ON public.lessons
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lessons" ON public.lessons
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- ENROLLMENTS POLICIES
-- ============================================
CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view all enrollments" ON public.enrollments
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own enrollments" ON public.enrollments
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON public.enrollments
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all enrollments" ON public.enrollments
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- LESSON_PROGRESS POLICIES
-- ============================================
CREATE POLICY "Users can view own progress" ON public.lesson_progress
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view all progress" ON public.lesson_progress
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own progress" ON public.lesson_progress
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.lesson_progress
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- CERTIFICATES POLICIES
-- ============================================
CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Certificates viewable by verification hash" ON public.certificates
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can view all certificates" ON public.certificates
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create certificates" ON public.certificates
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update certificates" ON public.certificates
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- BLOG_CATEGORIES POLICIES
-- ============================================
CREATE POLICY "Everyone can view blog categories" ON public.blog_categories
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can create blog categories" ON public.blog_categories
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog categories" ON public.blog_categories
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog categories" ON public.blog_categories
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- BLOG_POSTS POLICIES
-- ============================================
CREATE POLICY "Published blog posts viewable by all" ON public.blog_posts
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create blog posts" ON public.blog_posts
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PORTFOLIO_PROJECTS POLICIES
-- ============================================
CREATE POLICY "Published portfolio projects viewable by all" ON public.portfolio_projects
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can view all portfolio projects" ON public.portfolio_projects
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create portfolio projects" ON public.portfolio_projects
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio projects" ON public.portfolio_projects
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio projects" ON public.portfolio_projects
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- CONTACT_SUBMISSIONS POLICIES
-- ============================================
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- CAREER_APPLICATIONS POLICIES
-- ============================================
CREATE POLICY "Admins can view career applications" ON public.career_applications
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create career applications" ON public.career_applications
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update career applications" ON public.career_applications
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- COURSE_RESOURCES POLICIES
-- ============================================
CREATE POLICY "Course resources viewable by enrolled users" ON public.course_resources
  FOR SELECT 
  USING (
    is_active = true AND (
      EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE enrollments.user_id = auth.uid() 
        AND enrollments.course_id = course_resources.course_id
        AND enrollments.status = 'active'
      ) OR
      public.has_role(auth.uid(), 'instructor') OR
      public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Instructors can create course resources" ON public.course_resources
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can update course resources" ON public.course_resources
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course resources" ON public.course_resources
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- COURSE_REVIEWS POLICIES
-- ============================================
CREATE POLICY "Approved reviews viewable by all" ON public.course_reviews
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can view own reviews" ON public.course_reviews
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reviews" ON public.course_reviews
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Enrolled users can create reviews" ON public.course_reviews
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE enrollments.user_id = auth.uid() 
      AND enrollments.course_id = course_reviews.course_id
      AND enrollments.status = 'active'
    )
  );

CREATE POLICY "Users can update own reviews" ON public.course_reviews
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all reviews" ON public.course_reviews
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews" ON public.course_reviews
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- VISITOR_ANALYTICS POLICIES
-- ============================================
CREATE POLICY "Admins can view visitor analytics" ON public.visitor_analytics
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert visitor analytics" ON public.visitor_analytics
  FOR INSERT 
  WITH CHECK (true);