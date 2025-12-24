-- ============================================
-- VERIFY UPCOMING_PROGRAMS TABLE EXISTS
-- Run this first to check if the table exists
-- ============================================

-- Check if the table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'upcoming_programs'
    ) 
    THEN 'Table EXISTS ✓' 
    ELSE 'Table DOES NOT EXIST ✗' 
  END as table_status;

-- Check if the enum exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM pg_type 
      WHERE typname = 'program_status'
    ) 
    THEN 'Enum EXISTS ✓' 
    ELSE 'Enum DOES NOT EXIST ✗' 
  END as enum_status;

-- If table exists, show its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'upcoming_programs'
ORDER BY ordinal_position;

