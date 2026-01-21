
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, Edit, Trash, Eye, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const InstructorCourses = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            fetchCourses();
        }
    }, [user]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('instructor_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error(`Failed to load courses: ${(error as any).message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Course deleted');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                    <p className="text-muted-foreground">Manage your courses and content</p>
                </div>
                <div></div>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-dashed">
                    <h3 className="text-lg font-medium">No courses found</h3>
                    <p className="text-muted-foreground mb-4">Contact admin to get courses assigned</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="overflow-hidden flex flex-col">
                            <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                                {course.poster_url ? (
                                    <img src={course.poster_url} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-slate-800">
                                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                                        {course.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{course.description || 'No description'}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-0 pb-4">
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        {course.price_regular ? `$${course.price_regular}` : 'Free'}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => window.open(`/academy/${course.slug}`, '_blank')}>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorCourses;
