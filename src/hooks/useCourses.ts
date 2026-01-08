import { useQuery, useQueryClient } from '@tanstack/react-query';
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

// Simplified Course type for list view to avoid huge payloads
type CourseListItem = Pick<Course,
  'id' | 'title' | 'slug' | 'poster_url' | 'price_offer' | 'price_regular' |
  'course_type' | 'difficulty' | 'start_date' | 'end_date' | 'certificate' |
  'upcoming' | 'duration_text' | 'module_count' | 'topics' | 'status' | 'featured' | 'created_at'
>;

export const useCourses = (filters: CourseFilters, pagination: PaginationState) => {
  const queryClient = useQueryClient();

  // Create a unique key for the query based on filters and pagination
  const queryKey = ['courses', filters, pagination.page, pagination.pageSize];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select(`
          id, title, slug, poster_url, price_offer, price_regular,
          course_type, difficulty, start_date, end_date, certificate,
          upcoming, duration_text, module_count, topics, status, featured, created_at
        `, { count: 'exact' })
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

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        courses: (data as unknown as Course[]) || [],
        totalCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep showing previous data while fetching new page
  });

  const totalPages = query.data?.totalCount
    ? Math.ceil(query.data.totalCount / pagination.pageSize)
    : 0;

  return {
    courses: query.data?.courses || [],
    loading: query.isLoading,
    error: query.error ? 'Failed to load courses' : null,
    totalCount: query.data?.totalCount || 0,
    totalPages
  };
};

export const useCourseDetail = (slug: string | undefined) => {
  const queryClient = useQueryClient();

  const { data, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');

      // 1. Fetch course details (full details needed here)
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (courseError) throw courseError;

      // 2. Fetch enrollment count
      const { count: enrollmentCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseData.id)
        .neq('status', 'cancelled');

      const courseWithCount = {
        ...courseData,
        participant_count: enrollmentCount || 0
      } as unknown as Course;

      // 3. Fetch lessons (optimized fields), enrollment, and resources
      const { data: { user } } = await supabase.auth.getUser();

      // OPTIMIZED: Only select necessary lesson fields, NOT content
      const lessonsPromise = supabase
        .from('lessons')
        .select('id, title, lesson_order, description, is_active, course_id')
        .eq('course_id', courseData.id)
        .eq('is_active', true)
        .order('lesson_order', { ascending: true });

      let enrollmentPromise = Promise.resolve({ data: null });
      let resourcesPromise = Promise.resolve({ data: [] as Tables<'course_resources'>[] });

      if (user) {
        enrollmentPromise = supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', courseData.id)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle() as any;

        // Only fetch resources if enrolled (logic check inside component usually, but here is safe too)
        // Actually, let's fetch resources if enrolled check passes later, but for now we fetch all active resources
        // and filtered by backend RLS usually. But assuming public resources aren't a thing unless enrolled.
        // Let's stick to the original logic: fetch resources if enrolled. 
        // We can't know if enrolled until we fetch enrollment.
      }

      const [lessonsResult, enrollmentResult] = await Promise.all([
        lessonsPromise,
        enrollmentPromise
      ]);

      const enrollment = enrollmentResult.data;
      let resources: Tables<'course_resources'>[] = [];

      if (enrollment) {
        const { data: resData } = await supabase
          .from('course_resources')
          .select('*')
          .eq('course_id', courseData.id)
          .eq('is_active', true);
        resources = resData || [];
      }

      return {
        course: courseWithCount,
        lessons: lessonsResult.data || [],
        resources,
        isEnrolled: !!enrollment
      };
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes caching
  });

  return {
    course: data?.course || null,
    lessons: data?.lessons || [],
    resources: data?.resources || [],
    loading,
    error: error ? 'Failed to load course details' : null,
    isEnrolled: data?.isEnrolled || false,
    refetch
  };
};

export const useUniqueFilters = () => {
  const { data } = useQuery({
    queryKey: ['course-filters'],
    queryFn: async () => {
      const { data: typeData } = await supabase
        .from('courses')
        .select('course_type')
        .eq('status', 'published')
        .not('course_type', 'is', null);

      const uniqueTypes = [...new Set(typeData?.map(c => c.course_type).filter(Boolean))] as string[];

      const { data: diffData } = await supabase
        .from('courses')
        .select('difficulty')
        .eq('status', 'published')
        .not('difficulty', 'is', null);

      const uniqueDiffs = [...new Set(diffData?.map(c => c.difficulty).filter(Boolean))] as string[];

      return { types: uniqueTypes, difficulties: uniqueDiffs };
    },
    staleTime: Infinity, // These rarely change
  });

  return {
    types: data?.types || [],
    difficulties: data?.difficulties || []
  };
};
