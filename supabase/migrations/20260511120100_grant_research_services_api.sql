-- PostgREST accesses tables as anon / authenticated. New tables need explicit GRANTs
-- or clients get "permission denied for table research_services" (empty admin list).

GRANT SELECT ON TABLE public.research_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.research_services TO authenticated;
GRANT ALL ON TABLE public.research_services TO service_role;
