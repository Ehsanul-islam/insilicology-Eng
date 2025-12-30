
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalEarnings: 0,
        activeCourses: 0
    });
    const [recentCourses, setRecentCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                // Fetch courses count
                const { data: courses, error: coursesError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('instructor_id', user.id);

                if (coursesError) throw coursesError;

                const totalCourses = courses?.length || 0;
                const activeCourses = courses?.filter(c => c.status === 'published').length || 0;

                // Calculate students (simplified logic: sum of mock students count for now, or fetch enrollments)
                // If we have access to enrollments table, we can join.
                // For now, let's use the 'enrollments' table if possible, counting enrollments for these courses.

                const { count: enrollmentsCount, error: enrollmentsError } = await supabase
                    .from('enrollments')
                    .select('id', { count: 'exact', head: true })
                    .in('course_id', courses?.map(c => c.id) || []);

                // Allow failing silently for enrollments if permissions are tricky without more policies
                const totalStudents = enrollmentsCount || 0;

                setStats({
                    totalCourses,
                    totalStudents, // Placeholder or actual
                    totalEarnings: 0, // Placeholder
                    activeCourses
                });

                setRecentCourses(courses?.slice(0, 5) || []);

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
                <Skeleton className="h-64" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || 'Instructor'}!</p>
                </div>
                <div></div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">{stats.activeCourses} active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">+0% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0.0</div>
                        <p className="text-xs text-muted-foreground">No ratings yet</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Courses */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentCourses.length > 0 ? (
                            <div className="space-y-4">
                                {recentCourses.map((course) => (
                                    <div key={course.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            {course.poster_url && (
                                                <img src={course.poster_url} alt={course.title} className="h-10 w-16 object-cover rounded" />
                                            )}
                                            <div>
                                                <p className="font-medium">{course.title}</p>
                                                <p className="text-sm text-muted-foreground text-xs">{course.status}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link to={`/instructor/courses/${course.id}/edit`}>Edit</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                No courses found. Create your first course!
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Placeholder for future widgets */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default InstructorDashboard;
