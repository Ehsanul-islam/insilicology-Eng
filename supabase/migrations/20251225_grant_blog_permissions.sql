-- Grant permissions for blog tables
-- This fixes the "Failed to save category" error

-- Blog categories
GRANT ALL ON TABLE blog_categories TO authenticated;
GRANT SELECT ON TABLE blog_categories TO anon;

-- Blog posts (in case needed)
GRANT ALL ON TABLE blog_posts TO authenticated;
GRANT SELECT ON TABLE blog_posts TO anon;

-- Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
