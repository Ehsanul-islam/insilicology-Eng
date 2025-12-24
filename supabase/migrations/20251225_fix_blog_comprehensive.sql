-- Comprehensive blog permissions fix
-- Disable RLS and grant full permissions for blog tables

-- Disable RLS on blog tables
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;

-- Grant all permissions
GRANT ALL ON TABLE blog_posts TO authenticated;
GRANT ALL ON TABLE blog_categories TO authenticated;
GRANT SELECT ON TABLE blog_posts TO anon;
GRANT SELECT ON TABLE blog_categories TO anon;

-- Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Set table ownership
ALTER TABLE blog_posts OWNER TO postgres;
ALTER TABLE blog_categories OWNER TO postgres;
