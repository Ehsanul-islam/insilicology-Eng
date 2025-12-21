-- ============================================================
-- FULL DATABASE SETUP + DEMO COURSE
-- Run this in Supabase Dashboard > SQL Editor
-- This creates all tables AND seeds a demo course
-- ============================================================

-- ============================================================
-- PART 1: CREATE ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('student', 'admin', 'instructor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.course_type AS ENUM ('live', 'recorded', 'hybrid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.course_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enrollment_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.project_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.contact_status AS ENUM ('new', 'in_progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- PART 2: CREATE TABLES
-- ============================================================

-- User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Blog Categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses (with all landing page columns)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  promo_video_url TEXT,
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
  countdown_end_date TIMESTAMPTZ,
  -- Instructor info
  instructor_name TEXT,
  instructor_title TEXT,
  instructor_bio TEXT,
  instructor_photo TEXT,
  -- JSON fields
  stats JSONB DEFAULT '{}',
  topics JSONB DEFAULT '[]',
  whats_included JSONB DEFAULT '[]',
  roadmap JSONB DEFAULT '[]',
  why_join JSONB DEFAULT '[]',
  requirements JSONB DEFAULT '[]',
  learning_outcomes JSONB DEFAULT '[]',
  comparison_features JSONB DEFAULT '[]',
  target_audience JSONB DEFAULT '[]',
  value_breakdown JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  faq JSONB DEFAULT '[]',
  payment_methods JSONB DEFAULT '[]',
  payment_instructions TEXT,
  enrollment_form_fields JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
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
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  payment_method TEXT,
  payment_proof_url TEXT,
  custom_form_data JSONB,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  enrollment_date TIMESTAMPTZ DEFAULT NOW(),
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
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
CREATE TABLE IF NOT EXISTS public.certificates (
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
CREATE TABLE IF NOT EXISTS public.blog_posts (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Projects
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
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
CREATE TABLE IF NOT EXISTS public.career_applications (
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
CREATE TABLE IF NOT EXISTS public.course_resources (
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
CREATE TABLE IF NOT EXISTS public.course_reviews (
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
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
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

-- ============================================================
-- PART 3: CREATE FUNCTIONS
-- ============================================================

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- ============================================================
-- PART 4: CREATE TRIGGERS (with safety checks)
-- ============================================================

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.courses;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.lessons;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.enrollments;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PART 5: ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses policies (public read)
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;
CREATE POLICY "Published courses are viewable by everyone" ON public.courses FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Lessons policies
DROP POLICY IF EXISTS "Lessons viewable for enrolled users or preview" ON public.lessons;
CREATE POLICY "Lessons viewable for enrolled users or preview" ON public.lessons FOR SELECT USING (
  is_preview = true OR 
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = lessons.course_id AND user_id = auth.uid() AND status = 'active')
);

-- Enrollments policies
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create enrollments" ON public.enrollments;
CREATE POLICY "Users can create enrollments" ON public.enrollments FOR INSERT WITH CHECK (user_id = auth.uid());

-- Certificates policies
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING (user_id = auth.uid() OR is_active = true);

-- Contact submissions
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- ============================================================
-- PART 6: SEED DEMO COURSE
-- ============================================================

-- Delete existing demo course if exists
DELETE FROM public.lessons WHERE course_id IN (SELECT id FROM public.courses WHERE slug = 'complete-web-development-bootcamp');
DELETE FROM public.courses WHERE slug = 'complete-web-development-bootcamp';

-- Insert the demo course
INSERT INTO public.courses (
  slug, title, description, status, course_type, difficulty, featured, upcoming, certificate,
  duration_text, module_count, price_regular, price_offer, start_date, countdown_end_date,
  poster_url, promo_video_url, instructor_name, instructor_title, instructor_bio, instructor_photo,
  stats, topics, learning_outcomes, requirements, whats_included, why_join, roadmap,
  comparison_features, target_audience, value_breakdown, testimonials, faq,
  payment_methods, payment_instructions, enrollment_form_fields
) VALUES (
  'complete-web-development-bootcamp',
  'Complete Web Development Bootcamp 2025',
  'Master modern web development from scratch! This comprehensive bootcamp takes you from absolute beginner to professional developer. You''ll learn HTML, CSS, JavaScript, React, Node.js, and more through hands-on projects and real-world applications.

**What makes this course special?**

Our curriculum is designed by industry experts and updated regularly to reflect the latest trends and best practices. You won''t just watch videos – you''ll build real projects that you can add to your portfolio.',
  'published', 'live', 'beginner', true, false, true,
  '12 weeks', 24, 15000, 7999,
  (CURRENT_DATE + INTERVAL '7 days')::date,
  (CURRENT_DATE + INTERVAL '3 days')::timestamp,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Sarah Rahman',
  'Senior Software Engineer & Educator',
  'Sarah is a passionate educator with 10+ years of experience in web development. She has worked at top tech companies and helped over 50,000 students worldwide launch their careers in tech.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  '{"students": 12500, "community": "Active Discord", "support": "24/7 Help"}',
  '["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git", "Deployment"]',
  '["Build responsive websites from scratch", "Master JavaScript fundamentals", "Create dynamic web apps with React.js", "Build RESTful APIs with Node.js", "Work with databases", "Deploy to cloud platforms", "Implement authentication", "Write clean, tested code"]',
  '["Basic computer literacy", "A computer with internet", "Willingness to learn", "No prior experience required"]',
  '["24+ hours of HD video", "100+ coding exercises", "12 real-world projects", "Lifetime access", "Certificate", "Discord community", "1-on-1 mentorship", "Career guidance"]',
  '["Learn from industry experts", "Build 12+ portfolio projects", "Join 50,000+ developers", "Get personalized feedback", "Career support", "Money-back guarantee"]',
  '[{"title": "Foundation", "description": "HTML, CSS basics"}, {"title": "Styling", "description": "Advanced CSS, Flexbox, Grid"}, {"title": "JavaScript", "description": "Core JS concepts"}, {"title": "React", "description": "Components, hooks, state"}, {"title": "Backend", "description": "Node.js, Express, APIs"}, {"title": "Database", "description": "MongoDB, PostgreSQL"}, {"title": "Auth", "description": "JWT, OAuth, security"}, {"title": "Deploy", "description": "CI/CD, cloud platforms"}]',
  '[{"feature": "Live instructor sessions", "us": true, "others": false}, {"feature": "1-on-1 mentorship", "us": true, "others": false}, {"feature": "Real-world projects", "us": true, "others": true}, {"feature": "Job placement help", "us": true, "others": false}, {"feature": "Lifetime access", "us": true, "others": true}, {"feature": "Certificate", "us": true, "others": true}, {"feature": "24/7 support", "us": true, "others": false}, {"feature": "Code review", "us": true, "others": false}]',
  '[{"title": "Complete Beginners", "description": "No coding experience? Perfect!", "icon": "GraduationCap"}, {"title": "Career Changers", "description": "Switch to tech career", "icon": "Briefcase"}, {"title": "Students", "description": "Complement academic learning", "icon": "BookOpen"}, {"title": "Freelancers", "description": "Grow your business", "icon": "Laptop"}, {"title": "Entrepreneurs", "description": "Build your own apps", "icon": "Rocket"}, {"title": "Developers", "description": "Update your skills", "icon": "Code"}]',
  '[{"item": "24+ Hours Video Content", "original_price": 5000}, {"item": "100+ Coding Exercises", "original_price": 3000}, {"item": "12 Real Projects", "original_price": 8000}, {"item": "Discord Community", "original_price": 2000}, {"item": "1-on-1 Mentorship", "original_price": 5000}, {"item": "Certificate", "original_price": 1000}, {"item": "Career Guide", "original_price": 3000}, {"item": "Lifetime Updates", "original_price": 2000}]',
  '[{"name": "Rahim Ahmed", "role": "Frontend Developer", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "text": "This course changed my career!", "rating": 5}, {"name": "Fatima Khan", "role": "Freelancer", "text": "Built an amazing portfolio.", "rating": 5}, {"name": "Arif Hassan", "role": "Full Stack Dev", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "text": "Sarah is an incredible instructor.", "rating": 5}, {"name": "Nadia Islam", "role": "Software Engineer", "text": "The mentorship was invaluable.", "rating": 5}]',
  '[{"question": "Do I need prior experience?", "answer": "Not at all! This course is for complete beginners."}, {"question": "How long is access?", "answer": "Lifetime access to all materials and updates."}, {"question": "What if I get stuck?", "answer": "We have Discord community and 1-on-1 mentorship."}, {"question": "Is there a certificate?", "answer": "Yes, verified certificate upon completion."}, {"question": "Money-back guarantee?", "answer": "7-day full refund if not satisfied."}, {"question": "Mobile access?", "answer": "Yes, fully responsive platform."}]',
  '["bkash", "nagad", "bank_transfer"]',
  'Send payment to 01XXXXXXXXX (bKash/Nagad) or Bank: ABC Bank, Account: 1234567890',
  '[{"id": "phone", "label": "Phone Number", "type": "phone", "required": true}, {"id": "education", "label": "Education", "type": "select", "required": true, "options": ["High School", "Undergraduate", "Graduate", "Other"]}, {"id": "experience", "label": "Experience", "type": "select", "required": true, "options": ["Beginner", "Some", "Intermediate", "Advanced"]}]'
);

-- Insert lessons
INSERT INTO public.lessons (course_id, title, description, lesson_order, duration_minutes, is_preview, is_active, video_url)
SELECT c.id, l.title, l.description, l.order_num, l.duration, l.is_preview, true, l.video_url
FROM public.courses c
CROSS JOIN (VALUES 
  ('Module 1: Introduction', 'Welcome to web development!', 1, 15, true, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  ('Module 1: Setup Environment', 'Install VS Code and tools', 2, 20, true, NULL),
  ('Module 1: First HTML Page', 'Create your first webpage', 3, 25, false, NULL),
  ('Module 2: HTML Semantics', 'HTML5 semantic elements', 4, 30, false, NULL),
  ('Module 2: Forms', 'Build interactive forms', 5, 35, false, NULL),
  ('Module 3: CSS Basics', 'Styling fundamentals', 6, 40, false, NULL),
  ('Module 3: Flexbox', 'Modern CSS layouts', 7, 45, false, NULL),
  ('Module 3: CSS Grid', 'Complex layouts', 8, 40, false, NULL),
  ('Module 4: JS Basics', 'Variables and operators', 9, 35, false, NULL),
  ('Module 4: Functions', 'Understanding functions', 10, 40, false, NULL),
  ('Module 4: DOM', 'Interact with webpage', 11, 45, false, NULL),
  ('Module 5: React Intro', 'Getting started', 12, 50, false, NULL),
  ('Module 5: Components', 'Building components', 13, 45, false, NULL),
  ('Module 5: State & Hooks', 'Managing state', 14, 50, false, NULL),
  ('Module 6: Node.js', 'Server-side JS', 15, 40, false, NULL),
  ('Module 6: Express', 'Building APIs', 16, 45, false, NULL),
  ('Module 7: Databases', 'MongoDB & PostgreSQL', 17, 50, false, NULL),
  ('Module 7: Auth', 'User authentication', 18, 55, false, NULL),
  ('Module 8: Deployment', 'Cloud deployment', 19, 45, false, NULL),
  ('Module 8: Career Prep', 'Resume and interviews', 20, 60, false, NULL)
) AS l(title, description, order_num, duration, is_preview, video_url)
WHERE c.slug = 'complete-web-development-bootcamp';

-- Verify
SELECT 'SUCCESS! Demo course created.' AS result, id, title FROM public.courses WHERE slug = 'complete-web-development-bootcamp';

