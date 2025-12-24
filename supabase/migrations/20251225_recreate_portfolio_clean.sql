-- ============================================
-- CLEAN PORTFOLIO RECREATION SCRIPT
-- This drops everything portfolio-related and recreates it fresh
-- ============================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Public can view published portfolios" ON portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage all portfolios" ON portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage portfolios" ON portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated users full access to portfolios" ON portfolio_projects;

DROP POLICY IF EXISTS "Public can view categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Allow authenticated users full access to categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Public can view all categories" ON portfolio_categories;

-- Drop tables (CASCADE will remove all dependencies)
DROP TABLE IF EXISTS portfolio_projects CASCADE;
DROP TABLE IF EXISTS portfolio_categories CASCADE;

-- ============================================
-- CREATE PORTFOLIO_CATEGORIES TABLE
-- ============================================
CREATE TABLE portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO portfolio_categories (name, slug, icon, display_order) VALUES
  ('Web Development', 'web-development', '🌐', 1),
  ('Mobile Apps', 'mobile-apps', '📱', 2),
  ('Data Science', 'data-science', '📊', 3),
  ('Design', 'design', '🎨', 4),
  ('Other', 'other', '💼', 5);

-- ============================================
-- CREATE PORTFOLIO_PROJECTS TABLE
-- ============================================
CREATE TABLE portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text,
  description text,
  client_name text,
  country text,
  duration_text text,
  team_size text,
  category text,
  hero_image_url text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  technologies jsonb DEFAULT '[]'::jsonb,
  services jsonb DEFAULT '[]'::jsonb,
  results jsonb DEFAULT '[]'::jsonb,
  challenges jsonb DEFAULT '[]'::jsonb,
  solutions jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraint for status enum
  CONSTRAINT portfolio_projects_status_check CHECK (status IN ('draft', 'published', 'archived'))
);

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE PERMISSIVE POLICIES
-- ============================================

-- Portfolio Categories: Everyone can read, authenticated can manage
CREATE POLICY "Anyone can view categories"
ON portfolio_categories
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage categories"
ON portfolio_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Portfolio Projects: Public can view published, authenticated can manage all
CREATE POLICY "Anyone can view published portfolios"
ON portfolio_projects
FOR SELECT
USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert portfolios"
ON portfolio_projects
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolios"
ON portfolio_projects
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete portfolios"
ON portfolio_projects
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX idx_portfolio_projects_category ON portfolio_projects(category);
CREATE INDEX idx_portfolio_projects_status ON portfolio_projects(status);
CREATE INDEX idx_portfolio_projects_featured ON portfolio_projects(featured);
CREATE INDEX idx_portfolio_projects_slug ON portfolio_projects(slug);
CREATE INDEX idx_portfolio_categories_slug ON portfolio_categories(slug);

-- ============================================
-- CREATE UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_categories_updated_at
  BEFORE UPDATE ON portfolio_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
