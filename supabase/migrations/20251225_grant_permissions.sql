-- Grant explicit permissions to authenticated users
-- This bypasses RLS and grants direct table access

GRANT ALL ON TABLE portfolio_projects TO authenticated;
GRANT ALL ON TABLE portfolio_categories TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Also grant to anon role for good measure
GRANT SELECT ON TABLE portfolio_projects TO anon;
GRANT SELECT ON TABLE portfolio_categories TO anon;

-- Ensure the tables are owned by the right role
ALTER TABLE portfolio_projects OWNER TO postgres;
ALTER TABLE portfolio_categories OWNER TO postgres;
