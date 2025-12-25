import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingEnrollments: number;
  activeEnrollments: number;
  publishedCourses: number;
  draftCourses: number;
}

export interface EnrollmentWithDetails {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  payment_proof_url: string | null;
  created_at: string;
  enrollment_date: string;
  custom_form_data: Record<string, unknown>;
  user_email?: string;
  user_name?: string;
  course_title?: string;
}

export interface CourseWithDetails {
  id: string;
  title: string;
  slug: string;
  status: string;
  course_type: string;
  difficulty: string | null;
  price_regular: number | null;
  price_offer: number | null;
  featured: boolean;
  upcoming: boolean;
  created_at: string;
  enrollment_count?: number;
}

export const useAdminData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    pendingEnrollments: 0,
    activeEnrollments: 0,
    publishedCourses: 0,
    draftCourses: 0,
  });

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const { data } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });

    setIsAdmin(!!data);

    if (data) {
      fetchAdminStats();
    } else {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        profilesResult,
        coursesResult,
        enrollmentsResult,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id, status, price_offer, price_regular'),
        supabase.from('enrollments').select('id, status, payment_status'),
      ]);

      const totalUsers = profilesResult.count || 0;
      const courses = coursesResult.data || [];
      const enrollments = enrollmentsResult.data || [];

      const publishedCourses = courses.filter(c => c.status === 'published').length;
      const draftCourses = courses.filter(c => c.status === 'draft').length;

      const pendingEnrollments = enrollments.filter(e => e.status === 'pending').length;
      const activeEnrollments = enrollments.filter(e => e.status === 'active').length;

      // Calculate revenue from approved enrollments (simplified)
      const totalRevenue = activeEnrollments * 100; // Placeholder calculation

      setStats({
        totalUsers,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalRevenue,
        pendingEnrollments,
        activeEnrollments,
        publishedCourses,
        draftCourses,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async (filters?: {
    status?: string;
    search?: string;
  }): Promise<EnrollmentWithDetails[]> => {
    let query = supabase
      .from('enrollments')
      .select(`
        *,
        profiles!enrollments_user_id_fkey(full_name, email),
        courses!enrollments_course_id_fkey(title)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status as 'active' | 'cancelled' | 'pending' | 'completed');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }

    return (data || []).map((enrollment: any) => ({
      ...enrollment,
      user_email: enrollment.profiles?.email,
      user_name: enrollment.profiles?.full_name,
      course_title: enrollment.courses?.title,
    }));
  };

  const fetchCourses = async (): Promise<CourseWithDetails[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data || [];
  };

  const updateEnrollmentStatus = async (
    enrollmentId: string,
    status: 'active' | 'cancelled' | 'pending' | 'completed',
    rejectionReason?: string
  ) => {
    const updateData: Record<string, unknown> = {
      status: status as 'active' | 'cancelled' | 'pending' | 'completed',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id,
    };

    // Update payment status based on enrollment status
    if (status === 'active') {
      updateData.payment_status = 'paid';
    } else if (status === 'cancelled') {
      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }
      updateData.payment_status = 'failed';
    }

    const { error } = await supabase
      .from('enrollments')
      .update(updateData)
      .eq('id', enrollmentId);

    if (error) {
      throw error;
    }

    await fetchAdminStats();
  };

  const updateCourseStatus = async (courseId: string, status: 'published' | 'draft' | 'archived') => {
    const { error } = await supabase
      .from('courses')
      .update({ status })
      .eq('id', courseId);

    if (error) {
      throw error;
    }

    await fetchAdminStats();
  };

  const deleteCourse = async (courseId: string) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      throw error;
    }

    await fetchAdminStats();
  };

  return {
    loading,
    isAdmin,
    stats,
    fetchEnrollments,
    fetchCourses,
    updateEnrollmentStatus,
    updateCourseStatus,
    deleteCourse,
    refreshStats: fetchAdminStats,
  };
};
