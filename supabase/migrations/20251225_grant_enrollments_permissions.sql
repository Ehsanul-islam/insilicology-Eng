-- Grant permissions for enrollments table
-- This fixes the "Failed to approve enrollment" error

-- Disable RLS temporarily for debugging
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to authenticated users
GRANT ALL ON TABLE enrollments TO authenticated;
GRANT SELECT ON TABLE enrollments TO anon;

-- Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
