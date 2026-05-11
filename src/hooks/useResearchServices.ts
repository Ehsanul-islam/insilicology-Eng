import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  mapRowToResearchService,
  type ResearchService,
  type ResearchServiceRow,
} from '@/data/researchServices';

export type ResearchServiceStatus = 'draft' | 'published' | 'archived';

export type ResearchServiceInput = {
  slug: string;
  title: string;
  short_title: string;
  description: string;
  summary: string;
  image: string;
  price: string;
  timeline: string;
  icon: string;
  color: string;
  bg: string;
  card_class: string;
  accent: string;
  seo_title: string;
  seo_description: string;
  overview_bullets: string[];
  service_types: { title: string; description: string }[];
  sample_analyses: { title: string; description: string; image?: string; images?: string[]; caption?: string }[];
  client_requirements: string[];
  deliverables: string[];
  tools: string[];
  faqs: { question: string; answer: string }[];
  status: ResearchServiceStatus;
  display_order: number;
};

const TABLE = 'research_services';

/**
 * Hook for managing research_services rows.
 * Public reads filter by status='published'; admin reads return everything.
 *
 * The table is created in supabase/migrations/20260511100000_create_research_services.sql
 * Until that migration is applied to the database the queries will fail
 * gracefully (returning [] / null) so static fallback content keeps working.
 */
export const useResearchServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------
  // Public reads
  // ---------------------------------------------------------------

  const fetchPublishedServices = async (): Promise<ResearchService[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await (supabase as any)
        .from(TABLE)
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      return ((data ?? []) as ResearchServiceRow[]).map(mapRowToResearchService);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch research services';
      setError(message);
      // Stay quiet for public consumers; the caller falls back to static data.
      console.warn('Research services not available:', message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedServiceBySlug = async (
    slug: string,
  ): Promise<ResearchService | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await (supabase as any)
        .from(TABLE)
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) return null;
      return mapRowToResearchService(data as ResearchServiceRow);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Service not found';
      setError(message);
      console.warn('Research service not available:', message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // Admin reads
  // ---------------------------------------------------------------

  const fetchAllServices = async (): Promise<ResearchServiceRow[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await (supabase as any)
        .from(TABLE)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return (data ?? []) as ResearchServiceRow[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(message);
      console.error('Error fetching all research services:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceById = async (id: string): Promise<ResearchServiceRow | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await (supabase as any)
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return (data as ResearchServiceRow) ?? null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Service not found';
      setError(message);
      console.error('Error fetching research service by id:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------

  const createService = async (input: ResearchServiceInput) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await (supabase as any)
        .from(TABLE)
        .insert(input)
        .select()
        .single();

      if (createError) throw new Error(createError.message || 'Database error');
      return data as ResearchServiceRow;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create service';
      setError(message);
      console.error('Error creating research service:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, updates: Partial<ResearchServiceInput>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await (supabase as any)
        .from(TABLE)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message || 'Database error');
      return data as ResearchServiceRow;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update service';
      setError(message);
      console.error('Error updating research service:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await (supabase as any)
        .from(TABLE)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete service';
      setError(message);
      console.error('Error deleting research service:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = async (id: string, status: ResearchServiceStatus) =>
    updateService(id, { status });

  return {
    loading,
    error,
    fetchPublishedServices,
    fetchPublishedServiceBySlug,
    fetchAllServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    updateServiceStatus,
  };
};
