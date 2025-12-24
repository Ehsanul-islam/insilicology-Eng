import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  thumbnail: string | null;
  slug: string;
  courseId: string;
}

interface Certificate {
  id: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
  verificationHash: string;
}

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  totalHours: number;
}

interface RecentActivity {
  action: string;
  course: string;
  time: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    totalHours: 0,
  });
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch enrollments with course data
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress_percentage,
          status,
          course_id,
          courses (
            id,
            title,
            slug,
            poster_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (enrollError) throw enrollError;

      // Fetch certificates
      const { data: certsData, error: certsError } = await supabase
        .from('certificates')
        .select('id, course_name, completion_date, certificate_number, verification_hash')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('completion_date', { ascending: false });

      if (certsError) throw certsError;

      // Fetch lesson progress to calculate total hours
      const { data: progressData, error: progressError } = await supabase
        .from('lesson_progress')
        .select(`
          completed,
          lesson_id,
          lessons (
            duration_minutes
          )
        `)
        .eq('user_id', user.id)
        .eq('completed', true);

      if (progressError) throw progressError;

      // Calculate total hours
      const totalMinutes = progressData?.reduce((acc, progress) => {
        const lesson = progress.lessons as any;
        return acc + (lesson?.duration_minutes || 0);
      }, 0) || 0;
      const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

      // Process enrollments
      const coursesWithProgress: EnrolledCourse[] = enrollments?.map((enrollment: any) => ({
        id: enrollment.id,
        courseId: enrollment.course_id,
        title: enrollment.courses?.title || 'Untitled Course',
        progress: enrollment.progress_percentage || 0,
        thumbnail: enrollment.courses?.poster_url,
        slug: enrollment.courses?.slug || '',
      })) || [];

      // Process certificates
      const processedCertificates: Certificate[] = certsData?.map(cert => ({
        id: cert.id,
        courseName: cert.course_name,
        completionDate: cert.completion_date,
        certificateNumber: cert.certificate_number,
        verificationHash: cert.verification_hash,
      })) || [];

      // Calculate stats
      const completedCount = enrollments?.filter((e: any) => e.status === 'completed').length || 0;

      setStats({
        enrolledCourses: enrollments?.length || 0,
        completedCourses: completedCount,
        certificates: certsData?.length || 0,
        totalHours,
      });

      setEnrolledCourses(coursesWithProgress);
      setCertificates(processedCertificates);

      // Generate recent activity from enrollments and certificates
      const activities: RecentActivity[] = [];

      // Add recent completions
      const completedEnrollments = enrollments?.filter((e: any) => e.status === 'completed').slice(0, 2) || [];
      completedEnrollments.forEach((e: any) => {
        activities.push({
          action: 'Completed course',
          course: e.courses?.title || 'Unknown',
          time: 'Recently',
        });
      });

      // Add recent certificate earnings
      if (certsData && certsData.length > 0) {
        activities.push({
          action: 'Earned certificate',
          course: certsData[0].course_name,
          time: new Date(certsData[0].completion_date).toLocaleDateString(),
        });
      }

      // Add active enrollments
      const activeEnrollments = enrollments?.filter((e: any) => e.status === 'active').slice(0, 2) || [];
      activeEnrollments.forEach((e: any) => {
        activities.push({
          action: 'Currently learning',
          course: e.courses?.title || 'Unknown',
          time: 'In progress',
        });
      });

      setRecentActivity(activities.slice(0, 4));

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);

      // Only show error if it's a real error, not just empty data
      // Check if it's a permission/policy error
      if (error?.code === 'PGRST301' || error?.message?.includes('permission denied') || error?.message?.includes('policy')) {
        toast.error('Unable to access dashboard data. Please check your permissions.');
      } else if (error?.message && !error?.message?.includes('null')) {
        // Only show error if there's a meaningful error message
        toast.error('Failed to load dashboard data');
      }
      // If no error or it's just empty data, silently continue with empty state
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    stats,
    enrolledCourses,
    certificates,
    recentActivity,
    refreshData: fetchDashboardData,
  };
};
