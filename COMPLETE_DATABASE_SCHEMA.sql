-- ============================================
-- COMPLETE DATABASE SCHEMA
-- Zymios LMS Platform
-- Consolidated from 14 migration files
-- ============================================
-- IMPORTANT: Run this ONLY on a fresh/empty database
-- This will create ALL tables, policies, functions, and storage from scratch
-- ============================================

-- ============================================
-- STEP 1: CREATE ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('student', 'admin', 'instructor');
CREATE TYPE public.course_type AS ENUM ('live', 'recorded', 'hybrid');
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.enrollment_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE public.project_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.contact_status AS ENUM ('new', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.program_status AS ENUM ('draft', 'published', 'archived');

-- ============================================
-- STEP 2: CREATE CORE TABLES
-- ============================================

-- User Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Blog Categories
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Categories
CREATE TABLE public.portfolio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  course_type course_type DEFAULT 'recorded',
  difficulty difficulty_level,
  status course_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  upcoming BOOLEAN DEFAULT FALSE,
  price_regular DECIMAL(10,2),
  price_offer DECIMAL(10,2),
  duration_text TEXT,
  module_count INTEGER,
  certificate BOOLEAN DEFAULT TRUE,
  start_date DATE,
  topics JSONB DEFAULT '[]',
  whats_included JSONB DEFAULT '[]',
  roadmap JSONB DEFAULT '[]',
  why_join JSONB DEFAULT '[]',
  requirements JSONB DEFAULT '[]',
  learning_outcomes JSONB DEFAULT '[]',
  language TEXT,
  enrollment_form_fields JSONB DEFAULT '[]',
  payment_methods JSONB DEFAULT '["bank_transfer", "mobile_payment"]',
  payment_instructions TEXT,
  instructor_id UUID,
  instructor_name TEXT,
  instructor_title TEXT,
  instructor_bio TEXT,
  instructor_photo TEXT,
  comparison_features JSONB,
  target_audience JSONB,
  testimonials JSONB,
  value_breakdown JSONB,
  stats JSONB,
  faq JSONB,
  modules JSONB,
  promo_video_url TEXT,
  countdown_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Batches
CREATE TABLE public.course_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  lesson_order INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  enrollment_date TIMESTAMPTZ DEFAULT NOW(),
  completion_date TIMESTAMPTZ,
  payment_method TEXT,
  payment_proof_url TEXT,
  custom_form_data JSONB DEFAULT '{}',
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  position_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  verification_hash TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  completion_date DATE NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  certificate_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id),
  category_id UUID REFERENCES public.blog_categories(id),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0,
  tags TEXT[],
  reading_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Projects
CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  hero_image_url TEXT,
  client_name TEXT,
  country TEXT,
  duration_text TEXT,
  services JSONB DEFAULT '[]',
  technologies JSONB DEFAULT '[]',
  results JSONB DEFAULT '[]',
  status project_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  category_id UUID REFERENCES public.portfolio_categories(id),
  gallery_images JSONB DEFAULT '[]',
  challenges JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status contact_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career Applications
CREATE TABLE public.career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT NOT NULL,
  experience TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Resources
CREATE TABLE public.course_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Reviews
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Visitor Analytics
CREATE TABLE public.visitor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upcoming Programs
CREATE TABLE public.upcoming_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  start_date DATE NOT NULL,
  registration_link TEXT NOT NULL,
  status program_status DEFAULT 'draft',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema Versions (for tracking migrations)
CREATE TABLE public.schema_versions (
  id SERIAL PRIMARY KEY,
  version_name TEXT NOT NULL,
  description TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE INDEXES
-- ============================================
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_enrollments_payment_status ON public.enrollments(payment_status);
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_course_id ON public.lesson_progress(course_id);
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_portfolio_projects_slug ON public.portfolio_projects(slug);
CREATE INDEX idx_course_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX idx_upcoming_programs_status ON public.upcoming_programs(status);
CREATE INDEX idx_upcoming_programs_display_order ON public.upcoming_programs(display_order);
CREATE INDEX idx_upcoming_programs_start_date ON public.upcoming_programs(start_date);

-- ============================================
-- STEP 4: CREATE FUNCTIONS
-- ============================================

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Helper function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  
  -- Assign default 'student' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student'::public.app_role);
  
  RETURN NEW;
END;
$$;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Update upcoming_programs updated_at
CREATE OR REPLACE FUNCTION public.update_upcoming_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 5: CREATE TRIGGERS
-- ============================================

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.career_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_upcoming_programs_updated_at BEFORE UPDATE ON public.upcoming_programs FOR EACH ROW EXECUTE FUNCTION public.update_upcoming_programs_updated_at();

-- ============================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- ============================================
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
ALTER TABLE public.upcoming_programs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: CREATE RLS POLICIES
-- ============================================

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES POLICIES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- COURSES POLICIES
CREATE POLICY "Published courses are viewable by all" ON public.courses FOR SELECT USING (status = 'published');
CREATE POLICY "Instructors can view all courses" ON public.courses FOR SELECT USING (public.has_role(auth.uid(), 'instructor'));
CREATE POLICY "Admins can view all courses" ON public.courses FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can create courses" ON public.courses FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can update courses" ON public.courses FOR UPDATE USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- LESSONS POLICIES
CREATE POLICY "Lessons viewable if course is published or user is enrolled" ON public.lessons FOR SELECT USING (
  is_active = true AND (
    is_preview = true OR
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = lessons.course_id AND courses.status = 'published') OR
    EXISTS (SELECT 1 FROM public.enrollments WHERE enrollments.user_id = auth.uid() AND enrollments.course_id = lessons.course_id AND enrollments.status = 'active') OR
    public.has_role(auth.uid(), 'instructor') OR
    public.has_role(auth.uid(), 'admin')
  )
);
CREATE POLICY "Instructors can create lessons" ON public.lessons FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can update lessons" ON public.lessons FOR UPDATE USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete lessons" ON public.lessons FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ENROLLMENTS POLICIES
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Instructors can view all enrollments" ON public.enrollments FOR SELECT USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update all enrollments" ON public.enrollments FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- LESSON_PROGRESS POLICIES
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Instructors can view all progress" ON public.lesson_progress FOR SELECT USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- CERTIFICATES POLICIES
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Certificates viewable by verification hash" ON public.certificates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all certificates" ON public.certificates FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create certificates" ON public.certificates FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update certificates" ON public.certificates FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- BLOG_CATEGORIES POLICIES
CREATE POLICY "Everyone can view blog categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can create blog categories" ON public.blog_categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update blog categories" ON public.blog_categories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete blog categories" ON public.blog_categories FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- BLOG_POSTS POLICIES
CREATE POLICY "Published blog posts viewable by all" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create blog posts" ON public.blog_posts FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- PORTFOLIO_PROJECTS POLICIES
CREATE POLICY "Published portfolio projects viewable by all" ON public.portfolio_projects FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all portfolio projects" ON public.portfolio_projects FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create portfolio projects" ON public.portfolio_projects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio projects" ON public.portfolio_projects FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio projects" ON public.portfolio_projects FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- CONTACT_SUBMISSIONS POLICIES
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- CAREER_APPLICATIONS POLICIES
CREATE POLICY "Admins can view career applications" ON public.career_applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create career applications" ON public.career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update career applications" ON public.career_applications FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- COURSE_RESOURCES POLICIES
CREATE POLICY "Course resources viewable by enrolled users" ON public.course_resources FOR SELECT USING (
  is_active = true AND (
    EXISTS (SELECT 1 FROM public.enrollments WHERE enrollments.user_id = auth.uid() AND enrollments.course_id = course_resources.course_id AND enrollments.status = 'active') OR
    public.has_role(auth.uid(), 'instructor') OR
    public.has_role(auth.uid(), 'admin')
  )
);
CREATE POLICY "Instructors can create course resources" ON public.course_resources FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can update course resources" ON public.course_resources FOR UPDATE USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete course resources" ON public.course_resources FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- COURSE_REVIEWS POLICIES
CREATE POLICY "Approved reviews viewable by all" ON public.course_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own reviews" ON public.course_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all reviews" ON public.course_reviews FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Enrolled users can create reviews" ON public.course_reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM public.enrollments WHERE enrollments.user_id = auth.uid() AND enrollments.course_id = course_reviews.course_id AND enrollments.status = 'active')
);
CREATE POLICY "Users can update own reviews" ON public.course_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update all reviews" ON public.course_reviews FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.course_reviews FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- VISITOR_ANALYTICS POLICIES
CREATE POLICY "Admins can view visitor analytics" ON public.visitor_analytics FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert visitor analytics" ON public.visitor_analytics FOR INSERT WITH CHECK (true);

-- UPCOMING_PROGRAMS POLICIES
CREATE POLICY "Public can view published programs" ON public.upcoming_programs FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage upcoming programs" ON public.upcoming_programs FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Schema setup complete!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create your admin account via the signup page';
  RAISE NOTICE '2. Run UPDATE user_roles SET role = ''admin'' WHERE user_id = (your user ID)';
  RAISE NOTICE '3. Set up Storage buckets using the storage script provided';
  RAISE NOTICE '============================================';
END $$;
