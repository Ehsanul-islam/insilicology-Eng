-- ============================================
-- Migration: Create research_services table
-- ============================================
-- Manages all content shown on:
--   /research            (services grid + detailed cards)
--   /research/:slug      (full service detail page)
-- Admin can fully control titles, descriptions, requirements,
-- deliverables, sample outputs, FAQs, etc.
--
-- HOW TO RUN:
-- 1. Open the Supabase Dashboard
-- 2. Go to: SQL Editor (left sidebar)
-- 3. New Query → paste this file → Run.
-- ============================================

-- Reuse the program_status enum if it already exists, otherwise create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'program_status') THEN
    CREATE TYPE public.program_status AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;

-- Create research_services table
CREATE TABLE IF NOT EXISTS public.research_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifiers
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL DEFAULT '',

  -- Copy
  description TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',

  -- Visuals / metadata
  image TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT 'Custom quote',
  timeline TEXT NOT NULL DEFAULT '',

  -- Style tokens (Lucide icon name + Tailwind class strings)
  icon TEXT NOT NULL DEFAULT 'Atom',
  color TEXT NOT NULL DEFAULT 'text-blue-500',
  bg TEXT NOT NULL DEFAULT 'bg-blue-500/10',
  card_class TEXT NOT NULL DEFAULT 'bg-blue-500/[0.04] border-blue-500/20',
  accent TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',

  -- SEO
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',

  -- JSONB content arrays
  -- overview_bullets:        string[]
  -- service_types:           {title, description}[]
  -- sample_analyses:         {title, description, image?, caption?}[]
  -- client_requirements:     string[]
  -- deliverables:            string[]
  -- tools:                   string[]
  -- faqs:                    {question, answer}[]
  overview_bullets    JSONB NOT NULL DEFAULT '[]'::jsonb,
  service_types       JSONB NOT NULL DEFAULT '[]'::jsonb,
  sample_analyses     JSONB NOT NULL DEFAULT '[]'::jsonb,
  client_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables        JSONB NOT NULL DEFAULT '[]'::jsonb,
  tools               JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs                JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Publishing controls
  status program_status NOT NULL DEFAULT 'draft',
  display_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_research_services_status        ON public.research_services(status);
CREATE INDEX IF NOT EXISTS idx_research_services_display_order ON public.research_services(display_order);
CREATE INDEX IF NOT EXISTS idx_research_services_slug          ON public.research_services(slug);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_research_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_research_services_updated_at ON public.research_services;
CREATE TRIGGER update_research_services_updated_at
  BEFORE UPDATE ON public.research_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_research_services_updated_at();

-- Row Level Security
ALTER TABLE public.research_services ENABLE ROW LEVEL SECURITY;

-- Public can read published rows
DROP POLICY IF EXISTS "Public can view published research services" ON public.research_services;
CREATE POLICY "Public can view published research services"
  ON public.research_services
  FOR SELECT
  USING (status = 'published');

-- Admins can do everything
DROP POLICY IF EXISTS "Admins can manage research services" ON public.research_services;
CREATE POLICY "Admins can manage research services"
  ON public.research_services
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

DO $$
BEGIN
  RAISE NOTICE 'Migration completed: research_services table created with RLS policies.';
END $$;

-- API access (required or PostgREST returns "permission denied" and the admin list stays empty)
GRANT SELECT ON TABLE public.research_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.research_services TO authenticated;
GRANT ALL ON TABLE public.research_services TO service_role;
