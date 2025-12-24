-- Add SELECT permission for portfolio tables
-- The previous grant might not have included SELECT properly

GRANT SELECT ON TABLE portfolio_projects TO authenticated;
GRANT SELECT ON TABLE portfolio_categories TO authenticated;
GRANT SELECT ON TABLE portfolio_projects TO anon;
GRANT SELECT ON TABLE portfolio_categories TO anon;
