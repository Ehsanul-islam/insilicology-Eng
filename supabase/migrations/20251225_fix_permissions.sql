-- Relax RLS for portfolio_projects to allow authenticated users to manage them
-- This is useful for development if your user role is not correctly set to 'admin'

-- First, drop all existing policies that might be blocking access
DROP POLICY IF EXISTS "Public can view published portfolios" ON portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage all portfolios" ON portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage portfolios" ON portfolio_projects;

DROP POLICY IF EXISTS "Public can view categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON portfolio_categories;

-- Enable RLS
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for authenticated users
CREATE POLICY "Allow authenticated users full access to portfolios"
ON portfolio_projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to categories"
ON portfolio_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Also allow public read access for published portfolios
CREATE POLICY "Public can view published portfolios"
ON portfolio_projects
FOR SELECT
TO public
USING (status = 'published');

CREATE POLICY "Public can view all categories"
ON portfolio_categories
FOR SELECT
TO public
USING (true);

