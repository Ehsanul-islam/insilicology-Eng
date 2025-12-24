-- Extend portfolio_projects table with additional fields
ALTER TABLE portfolio_projects
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS team_size text,
ADD COLUMN IF NOT EXISTS challenges jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS solutions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Create portfolio_categories table
CREATE TABLE IF NOT EXISTS portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Safely add columns if the table already exists but lacks them
DO $$
BEGIN
    ALTER TABLE portfolio_categories ADD COLUMN IF NOT EXISTS icon text;
    ALTER TABLE portfolio_categories ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Insert default categories
INSERT INTO portfolio_categories (name, slug, icon, display_order) VALUES
  ('Web Development', 'web-development', '🌐', 1),
  ('Mobile Apps', 'mobile-apps', '📱', 2),
  ('Data Science', 'data-science', '📊', 3),
  ('Design', 'design', '🎨', 4),
  ('Other', 'other', '💼', 5)
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_projects
-- Public can read published portfolios
DROP POLICY IF EXISTS "Public can view published portfolios" ON portfolio_projects;
CREATE POLICY "Public can view published portfolios"
  ON portfolio_projects FOR SELECT
  USING (status = 'published');

-- Admins can do everything
DROP POLICY IF EXISTS "Admins can manage all portfolios" ON portfolio_projects;
CREATE POLICY "Admins can manage all portfolios"
  ON portfolio_projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policies for portfolio_categories
-- Public can read all categories
CREATE POLICY "Public can view categories"
  ON portfolio_categories FOR SELECT
  TO public
  USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON portfolio_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create updated_at trigger for portfolio_categories
CREATE OR REPLACE FUNCTION update_portfolio_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS portfolio_categories_updated_at ON portfolio_categories;
CREATE TRIGGER portfolio_categories_updated_at
  BEFORE UPDATE ON portfolio_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_categories_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_category ON portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_status ON portfolio_projects(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON portfolio_projects(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_slug ON portfolio_categories(slug);

