import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { useAdminData } from '@/hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  BookOpen,
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';

interface RecentEnrollment {
  id: string;
  user_name: string;
  course_title: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { loading, isAdmin, stats } = useAdminData();
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    fetchRecentEnrollments();
  }, []);

  const fetchRecentEnrollments = async () => {
    try {
      const { data } = await supabase
        .from('enrollments')
        .select(`
          id,
          status,
          created_at,
          profiles!enrollments_user_id_fkey(full_name),
          courses!enrollments_course_id_fkey(title)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setRecentEnrollments(
          data.map((e: any) => ({
            id: e.id,
            user_name: e.profiles?.full_name || 'Unknown',
            course_title: e.courses?.title || 'Unknown Course',
            status: e.status,
            created_at: e.created_at,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching recent enrollments:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      active: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <AdminLayout title="Dashboard">
      <SEOHead
        title="Admin Dashboard - LearnCraft"
        description="Manage your learning platform"
        url="/admin"
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="Registered users"
          />
          <StatsCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            description={`${stats.publishedCourses} published, ${stats.draftCourses} drafts`}
          />
          <StatsCard
            title="Enrollments"
            value={stats.totalEnrollments}
            icon={CreditCard}
            description={`${stats.pendingEnrollments} pending approval`}
          />
          <StatsCard
            title="Active Students"
            value={stats.activeEnrollments}
            icon={TrendingUp}
            description="Currently learning"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Actions */}
          {stats.pendingEnrollments > 0 && (
            <Card className="border-accent/50 bg-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-accent" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingEnrollments}</p>
                    <p className="text-sm text-muted-foreground">
                      Enrollments awaiting approval
                    </p>
                  </div>
                  <Button asChild>
                    <Link to="/admin/enrollments?status=pending">
                      Review Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Enrollments */}
          <Card className={stats.pendingEnrollments > 0 ? '' : 'lg:col-span-2'}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Enrollments</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/enrollments">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingRecent ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentEnrollments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No recent enrollments
                </p>
              ) : (
                <div className="space-y-3">
                  {recentEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{enrollment.user_name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {enrollment.course_title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(enrollment.status)}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(enrollment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/courses/new">
                  <BookOpen className="w-5 h-5" />
                  <span>Add Course</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/blog/new">
                  <BookOpen className="w-5 h-5" />
                  <span>New Blog Post</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/certificates">
                  <CreditCard className="w-5 h-5" />
                  <span>Issue Certificate</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/users">
                  <Users className="w-5 h-5" />
                  <span>Manage Users</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
