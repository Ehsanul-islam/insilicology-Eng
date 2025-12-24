import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type UpcomingProgram = Tables<'upcoming_programs'>;
export type UpcomingProgramInsert = TablesInsert<'upcoming_programs'>;
export type UpcomingProgramUpdate = TablesUpdate<'upcoming_programs'>;

export const useUpcomingPrograms = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch published upcoming programs (for public display)
   */
  const fetchUpcomingPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('upcoming_programs')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: true });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming programs';
      setError(errorMessage);
      console.error('Error fetching upcoming programs:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all programs (for admin)
   */
  const fetchAllPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('upcoming_programs')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch programs';
      setError(errorMessage);
      console.error('Error fetching all programs:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single program by ID
   */
  const fetchProgramById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('upcoming_programs')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Program not found';
      setError(errorMessage);
      console.error('Error fetching program by ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new program
   */
  const createProgram = async (program: UpcomingProgramInsert) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from('upcoming_programs')
        .insert(program)
        .select()
        .single();

      if (createError) {
        console.error('Supabase error creating program:', createError);
        throw new Error(createError.message || 'Database error occurred');
      }
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during program creation';
      setError(errorMessage);
      console.error('Error creating program:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing program
   */
  const updateProgram = async (id: string, updates: UpcomingProgramUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('upcoming_programs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update program';
      setError(errorMessage);
      console.error('Error updating program:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a program
   */
  const deleteProgram = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('upcoming_programs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete program';
      setError(errorMessage);
      console.error('Error deleting program:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update program status
   */
  const updateProgramStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
    return updateProgram(id, { status });
  };

  return {
    loading,
    error,
    fetchUpcomingPrograms,
    fetchAllPrograms,
    fetchProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    updateProgramStatus,
  };
};

