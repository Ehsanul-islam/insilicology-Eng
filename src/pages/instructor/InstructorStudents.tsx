import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const InstructorStudents = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            fetchStudents();
        }
    }, [user]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
                    id,
                    created_at,
                    user_id,
                    course_id,
                    progress,
                    completed,
                    user:profiles!enrollments_user_id_fkey(
                        id,
                        full_name,
                        email,
                        avatar_url
                    ),
                    course:courses!inner(
                        title,
                        instructor_id
                    )
                `)
                .eq('course.instructor_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(enrollment => {
        const studentName = enrollment.user?.full_name?.toLowerCase() || '';
        const studentEmail = enrollment.user?.email?.toLowerCase() || '';
        const courseTitle = enrollment.course?.title?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return studentName.includes(search) ||
            studentEmail.includes(search) ||
            courseTitle.includes(search);
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <p className="text-muted-foreground">Detailed view of students enrolled in your courses</p>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search students or courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            ) : filteredStudents.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <p>No students found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredStudents.map((enrollment) => (
                        <Card key={enrollment.id}>
                            <CardContent className="flex items-center gap-4 p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={enrollment.user?.avatar_url} />
                                    <AvatarFallback>{enrollment.user?.full_name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold truncate">{enrollment.user?.full_name || 'Unknown User'}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {enrollment.user?.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Enrolled {format(new Date(enrollment.created_at), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">
                                        <span className="text-muted-foreground">Course: </span>
                                        <span className="font-medium">{enrollment.course?.title}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium">Progress</div>
                                    <div className="text-2xl font-bold">{enrollment.progress || 0}%</div>
                                    {enrollment.completed && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                            Completed
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorStudents;
