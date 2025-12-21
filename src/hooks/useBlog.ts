import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type BlogPost = Tables<'blog_posts'>;
export type BlogCategory = Tables<'blog_categories'>;
export type BlogPostInsert = TablesInsert<'blog_posts'>;
export type BlogPostUpdate = TablesUpdate<'blog_posts'>;

interface FetchBlogPostsOptions {
  published?: boolean;
  category?: string;
  featured?: boolean;
  search?: string;
}

export const useBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate reading time from markdown content
   */
  const calculateReadTime = (content: string | null): string => {
    if (!content) return '1 min read';
    
    // Remove markdown syntax and count words
    const text = content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]+`/g, '') // Remove inline code
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links but keep text
      .replace(/[#*\-_~`]/g, '') // Remove markdown formatting
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
    
    return `${readingTime} min read`;
  };

  /**
   * Fetch blog posts with optional filters
   */
  const fetchBlogPosts = async (options: FetchBlogPostsOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories:category_id (
            id,
            name,
            slug
          ),
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.published !== undefined) {
        query = query.eq('published', options.published);
      }
      if (options.category) {
        query = query.eq('category_id', options.category);
      }
      if (options.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }
      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog posts';
      setError(errorMessage);
      console.error('Error fetching blog posts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all published blog posts (for public page)
   */
  const fetchPublishedBlogPosts = async (category?: string) => {
    return fetchBlogPosts({ published: true, category });
  };

  /**
   * Fetch a single blog post by slug
   */
  const fetchBlogPostBySlug = async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories:category_id (
            id,
            name,
            slug
          ),
          profiles:author_id (
            id,
            full_name,
            avatar_url,
            bio
          )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (fetchError) throw fetchError;
      
      // Increment view count
      if (data) {
        await supabase
          .from('blog_posts')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Blog post not found';
      setError(errorMessage);
      console.error('Error fetching blog post by slug:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single blog post by ID (for admin editing)
   */
  const fetchBlogPostById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories:category_id (
            id,
            name,
            slug
          ),
          profiles:author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Blog post not found';
      setError(errorMessage);
      console.error('Error fetching blog post by ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new blog post
   */
  const createBlogPost = async (post: BlogPostInsert) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();

      if (createError) throw createError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create blog post';
      setError(errorMessage);
      console.error('Error creating blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing blog post
   */
  const updateBlogPost = async (id: string, updates: BlogPostUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update blog post';
      setError(errorMessage);
      console.error('Error updating blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a blog post
   */
  const deleteBlogPost = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete blog post';
      setError(errorMessage);
      console.error('Error deleting blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update blog post published status
   */
  const updateBlogPostStatus = async (id: string, published: boolean) => {
    const updates: BlogPostUpdate = { 
      published,
      ...(published && !published ? {} : { published_at: published ? new Date().toISOString() : null })
    };
    return updateBlogPost(id, updates);
  };

  /**
   * Toggle featured status
   */
  const toggleFeatured = async (id: string, featured: boolean) => {
    return updateBlogPost(id, { featured });
  };

  /**
   * Fetch all categories
   */
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new category
   */
  const createCategory = async (category: TablesInsert<'blog_categories'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from('blog_categories')
        .insert(category)
        .select()
        .single();

      if (createError) throw createError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a category
   */
  const updateCategory = async (id: string, updates: TablesUpdate<'blog_categories'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('blog_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
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
        .from('blog_posts')
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
   * Fetch related posts (same category, exclude current)
   */
  const fetchRelatedPosts = async (categoryId: string, excludeId: string, limit: number = 3) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          title,
          excerpt,
          featured_image,
          blog_categories:category_id (
            name,
            slug
          )
        `)
        .eq('category_id', categoryId)
        .eq('published', true)
        .neq('id', excludeId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch related posts';
      setError(errorMessage);
      console.error('Error fetching related posts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchBlogPosts,
    fetchPublishedBlogPosts,
    fetchBlogPostBySlug,
    fetchBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    updateBlogPostStatus,
    toggleFeatured,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    generateSlug,
    isSlugUnique,
    calculateReadTime,
    fetchRelatedPosts,
  };
};

