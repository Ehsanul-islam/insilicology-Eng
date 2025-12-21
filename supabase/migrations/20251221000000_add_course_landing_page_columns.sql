-- Phase 2: Add new columns to courses table for enhanced landing pages
-- Migration: Add instructor info, promo video, comparison features, and marketing fields

-- Instructor Information
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS instructor_name text,
ADD COLUMN IF NOT EXISTS instructor_title text,
ADD COLUMN IF NOT EXISTS instructor_bio text,
ADD COLUMN IF NOT EXISTS instructor_photo text;

-- Promo Video
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS promo_video_url text;

-- Comparison Features (Array of {feature, us, others})
-- Example: [{"feature": "Live AI Projects", "us": true, "others": false}]
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS comparison_features jsonb DEFAULT '[]'::jsonb;

-- Target Audience (Array of {title, description, icon})
-- Example: [{"title": "Fresher", "description": "New to AI? Start your journey here", "icon": "GraduationCap"}]
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS target_audience jsonb DEFAULT '[]'::jsonb;

-- FAQ (Array of {question, answer})
-- Example: [{"question": "How long do I have access?", "answer": "Lifetime access to all content."}]
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb;

-- Testimonials (Array of {name, role, video_url, thumbnail})
-- Example: [{"name": "John Doe", "role": "Software Engineer", "video_url": "https://...", "thumbnail": "https://..."}]
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS testimonials jsonb DEFAULT '[]'::jsonb;

-- Value Breakdown (Array of {item, original_price})
-- Example: [{"item": "AI Fundamentals Course", "original_price": 4999}]
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS value_breakdown jsonb DEFAULT '[]'::jsonb;

-- Countdown End Date for limited offers
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS countdown_end_date timestamptz;

-- Stats for social proof ({students, community, support})
-- Example: {"students": 500, "community": "Active Discord", "support": "24/7"}
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS stats jsonb DEFAULT '{}'::jsonb;

-- Add comments to document the JSON structures
COMMENT ON COLUMN public.courses.comparison_features IS 'Array of {feature: string, us: boolean, others: boolean}';
COMMENT ON COLUMN public.courses.target_audience IS 'Array of {title: string, description: string, icon: string}';
COMMENT ON COLUMN public.courses.faq IS 'Array of {question: string, answer: string}';
COMMENT ON COLUMN public.courses.testimonials IS 'Array of {name: string, role: string, video_url: string, thumbnail: string}';
COMMENT ON COLUMN public.courses.value_breakdown IS 'Array of {item: string, original_price: number}';
COMMENT ON COLUMN public.courses.stats IS 'Object {students: number, community: string, support: string}';




