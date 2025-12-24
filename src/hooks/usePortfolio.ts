import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type PortfolioProject = Tables<'portfolio_projects'>;
export type PortfolioInsert = TablesInsert<'portfolio_projects'>;
export type PortfolioUpdate = TablesUpdate<'portfolio_projects'>;

interface FetchPortfoliosOptions {
    status?: 'draft' | 'published' | 'archived';
    featured?: boolean;
    search?: string;
}

export const usePortfolio = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch portfolios with optional filters
     */
    const fetchPortfolios = async (options: FetchPortfoliosOptions = {}) => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from('portfolio_projects')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply filters
            if (options.status) {
                query = query.eq('status', options.status);
            }
            if (options.featured !== undefined) {
                query = query.eq('featured', options.featured);
            }
            if (options.search) {
                query = query.or(`title.ilike.%${options.search}%,summary.ilike.%${options.search}%,client_name.ilike.%${options.search}%`);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            return data || [];
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolios';
            setError(errorMessage);
            console.error('Error fetching portfolios:', err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch all published portfolios (for public page)
     */
    const fetchPublishedPortfolios = async () => {
        return fetchPortfolios({ status: 'published' });
    };

    /**
     * Fetch a single portfolio by slug
     */
    const fetchPortfolioBySlug = async (slug: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('portfolio_projects')
                .select('*')
                .eq('slug', slug)
                .single();

            if (fetchError) throw fetchError;
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Portfolio not found';
            setError(errorMessage);
            console.error('Error fetching portfolio by slug:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch a single portfolio by ID
     */
    const fetchPortfolioById = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('portfolio_projects')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Portfolio not found';
            setError(errorMessage);
            console.error('Error fetching portfolio by ID:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create a new portfolio
     */
    const createPortfolio = async (portfolio: PortfolioInsert) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: createError } = await supabase
                .from('portfolio_projects')
                .insert(portfolio)
                .select()
                .single();

            if (createError) throw createError;
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create portfolio';
            setError(errorMessage);
            console.error('Error creating portfolio:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update an existing portfolio
     */
    const updatePortfolio = async (id: string, updates: PortfolioUpdate) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: updateError } = await supabase
                .from('portfolio_projects')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update portfolio';
            setError(errorMessage);
            console.error('Error updating portfolio:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete a portfolio
     */
    const deletePortfolio = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const { error: deleteError } = await supabase
                .from('portfolio_projects')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete portfolio';
            setError(errorMessage);
            console.error('Error deleting portfolio:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update portfolio status
     */
    const updatePortfolioStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
        return updatePortfolio(id, { status } as PortfolioUpdate);
    };

    /**
     * Toggle featured status
     */
    const toggleFeatured = async (id: string, featured: boolean) => {
        return updatePortfolio(id, { featured } as PortfolioUpdate);
    };

    /**
     * Generate slug from title
     */
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    /**
     * Check if slug is unique
     */
    const isSlugUnique = async (slug: string, excludeId?: string): Promise<boolean> => {
        try {
            let query = supabase
                .from('portfolio_projects')
                .select('id')
                .eq('slug', slug);

            if (excludeId) {
                query = query.neq('id', excludeId);
            }

            const { data } = await query;
            return !data || data.length === 0;
        } catch (err) {
            console.error('Error checking slug uniqueness:', err);
            return false;
        }
    };

    /**
     * Fetch categories (stub function - portfolio doesn't have categories yet)
     * Returns empty array to prevent errors in components that call this function
     */
    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_categories')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                console.error('Error fetching categories:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('Error in fetchCategories:', err);
            return [];
        }
    };

    return {
        loading,
        error,
        fetchPortfolios,
        fetchPublishedPortfolios,
        fetchPortfolioBySlug,
        fetchPortfolioById,
        createPortfolio,
        updatePortfolio,
        deletePortfolio,
        updatePortfolioStatus,
        toggleFeatured,
        generateSlug,
        isSlugUnique,
        fetchCategories,
    };
};
