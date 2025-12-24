-- TEMPORARY WORKAROUND: Disable RLS entirely for portfolio tables
-- WARNING: This removes all security. Only use for debugging!
-- Re-enable RLS and proper policies once the issue is identified.

ALTER TABLE portfolio_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories DISABLE ROW LEVEL SECURITY;
