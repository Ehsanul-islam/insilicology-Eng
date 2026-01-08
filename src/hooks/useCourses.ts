import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Course = Tables<'courses'> & {
  end_date?: string | null;
  course_time?: string | null;
  participant_count?: number | null;
};

export type CourseFilters = {
  search: string;
  type: string;
  difficulty: string;
  priceRange: string;
  sortBy: string;
};

export type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
};

export const useCourses = (filters: CourseFilters, pagination: PaginationState) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('courses')
          .select('*', { count: 'exact' })
          .eq('status', 'published');

        // Search filter
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // Type filter
        if (filters.type && filters.type !== 'all') {
          query = query.eq('course_type', filters.type as 'recorded' | 'live' | 'hybrid');
        }

        // Difficulty filter
        if (filters.difficulty && filters.difficulty !== 'all') {
          query = query.eq('difficulty', filters.difficulty as 'beginner' | 'intermediate' | 'advanced');
        }

        // Price range filter
        if (filters.priceRange && filters.priceRange !== 'all') {
          switch (filters.priceRange) {
            case 'free':
              query = query.or('price_offer.is.null,price_offer.eq.0');
              break;
            case 'under50':
              query = query.lt('price_offer', 50);
              break;
            case '50to100':
              query = query.gte('price_offer', 50).lt('price_offer', 100);
              break;
            case 'over100':
              query = query.gte('price_offer', 100);
              break;
          }
        }

        // Sorting
        switch (filters.sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'price-low':
            query = query.order('price_offer', { ascending: true, nullsFirst: true });
            break;
          case 'price-high':
            query = query.order('price_offer', { ascending: false, nullsFirst: false });
            break;
          case 'featured':
            query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        // Pagination
        const from = (pagination.page - 1) * pagination.pageSize;
        const to = from + pagination.pageSize - 1;
        query = query.range(from, to);

        const { data, error: fetchError, count } = await query;

        if (fetchError) throw fetchError;

        setCourses((data as unknown as Course[]) || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters, pagination.page, pagination.pageSize]);

  const totalPages = useMemo(() =>
    Math.ceil(totalCount / pagination.pageSize),
    [totalCount, pagination.pageSize]
  );

  return { courses, loading, error, totalCount, totalPages };
};

export const useCourseDetail = (slug: string | undefined) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Tables<'lessons'>[]>([]);

  const [resources, setResources] = useState<Tables<'course_resources'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourseDetail = async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (courseError) throw courseError;

      // Fetch enrollment count
      const { count: enrollmentCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseData.id)
        .neq('status', 'cancelled');

      setCourse({
        ...courseData,
        participant_count: enrollmentCount || 0
      } as unknown as Course);

      // Fetch lessons, enrollment, and resources in parallel
      const fetchRelatedData = async (courseId: string) => {
        const { data: { user } } = await supabase.auth.getUser();

        const lessonsPromise = supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseId)
          .eq('is_active', true)
          .order('lesson_order', { ascending: true });

        // If no user, we can skip enrollment and user-specific resources fetch
        if (!user) {
          const [lessonsResult] = await Promise.all([lessonsPromise]);
          return {
            lessons: lessonsResult.data || [],
            enrollment: null,
            resources: []
          };
        }

        const enrollmentPromise = supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        const [lessonsResult, enrollmentResult] = await Promise.all([
          lessonsPromise,
          enrollmentPromise
        ]);

        const enrollment = enrollmentResult.data;
        let resourcesData: Tables<'course_resources'>[] = [];

        if (enrollment) {
          const { data } = await supabase
            .from('course_resources')
            .select('*')
            .eq('course_id', courseId)
            .eq('is_active', true);
          resourcesData = data || [];
        }

        return {
          lessons: lessonsResult.data || [],
          enrollment,
          resources: resourcesData
        };
      };

      const { lessons, enrollment, resources } = await fetchRelatedData(courseData.id);

      setLessons(lessons);
      setIsEnrolled(!!enrollment);
      setResources(resources);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [slug]);

  const refetch = () => {
    fetchCourseDetail();
  };

  return { course, lessons, resources, loading, error, isEnrolled, refetch };
};

export const useUniqueFilters = () => {
  const [types, setTypes] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      // Get unique course types
      const { data: typeData } = await supabase
        .from('courses')
        .select('course_type')
        .eq('status', 'published')
        .not('course_type', 'is', null);

      const uniqueTypes = [...new Set(typeData?.map(c => c.course_type).filter(Boolean))] as string[];
      setTypes(uniqueTypes);

      // Get unique difficulties
      const { data: diffData } = await supabase
        .from('courses')
        .select('difficulty')
        .eq('status', 'published')
        .not('difficulty', 'is', null);

      const uniqueDiffs = [...new Set(diffData?.map(c => c.difficulty).filter(Boolean))] as string[];
      setDifficulties(uniqueDiffs);
    };

    fetchFilters();
  }, []);

  return { types, difficulties };
};
