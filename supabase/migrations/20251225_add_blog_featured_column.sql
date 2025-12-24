-- Add missing featured column to blog_posts table
-- This fixes the "Could not find the 'featured' column" error

ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Reload schema cache hint: After running this, go to Supabase Dashboard > 
-- Project Settings > API > Click "Reload schema cache" at the bottom
