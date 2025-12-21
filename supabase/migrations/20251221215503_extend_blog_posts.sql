-- Extend blog_posts table with tags and featured fields
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Create index for featured posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);

-- Create index for tags (GIN index for JSONB queries)
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING gin(tags);

