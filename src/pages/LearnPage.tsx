import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Circle,
    PlayCircle,
    BookOpen,
    Download,
    Home,
    Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';

interface Lesson {
    id: string;
    title: string;
    description: string | null;
    video_url: string | null;
    duration_minutes: number | null;
    lesson_order: number;
    is_preview: boolean;
    resources?: any;
}

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: string | null;
}

interface LessonProgress {
    lesson_id: string;
    completed: boolean;
    last_position: number;
}

const LearnPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isArchived, setIsArchived] = useState(false);


    useEffect(() => {
        if (slug && user) {
            loadCourseData();
        }
    }, [slug, user]);

    const loadCourseData = async () => {
        try {
            // Fetch course
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('id, title, slug, description, status')
                .eq('slug', slug)
                .maybeSingle();

            if (courseError) throw courseError;

            if (!courseData) {
                console.error('Course not found:', slug);
                toast.error('Course not found');
                navigate('/courses');
                return;
            }

            setCourse(courseData);

            // Note if course is archived — enrolled students still get access,
            // we just show them a banner. Non-enrolled users are gated below
            // by the enrollment check (and blocked at DB level via RLS).
            if ((courseData as any).status === 'archived') {
                setIsArchived(true);
            }

            // Check enrollment
            const { data: enrollmentData } = await supabase
                .from('enrollments')
                .select('id, status')
                .eq('user_id', user!.id)
                .eq('course_id', courseData.id)
                .eq('status', 'active')
                .maybeSingle();

            if (!enrollmentData) {
                toast.error('You need to enroll in this course first');
                navigate(`/courses/${slug}`);
                return;
            }
            setIsEnrolled(true);

            // Fetch lessons
            const { data: lessonsData, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseData.id)
                .order('order_index', { ascending: true });

            if (lessonsError) throw lessonsError;
            setLessons(lessonsData || []);

            // Fetch progress
            const { data: progressData } = await supabase
                .from('lesson_progress')
                .select('*')
                .eq('user_id', user!.id)
                .eq('course_id', courseData.id);

            const progressMap: Record<string, LessonProgress> = {};
            (progressData || []).forEach((p: any) => {
                progressMap[p.lesson_id] = {
                    lesson_id: p.lesson_id,
                    completed: p.completed,
                    last_position: p.last_position || 0,
                };
            });
            setProgress(progressMap);

            // Set first incomplete lesson or first lesson
            const firstIncomplete = lessonsData?.find(
                (l) => !progressMap[l.id]?.completed
            );
            setCurrentLesson(firstIncomplete || lessonsData?.[0] || null);
        } catch (error) {
            console.error('Error loading course:', error);
            toast.error('Failed to load course');
        } finally {
            setLoading(false);
        }
    };

    const markLessonComplete = async (lessonId: string) => {
        if (!user || !course) return;

        try {
            const { error } = await supabase.from('lesson_progress').upsert({
                user_id: user.id,
                course_id: course.id,
                lesson_id: lessonId,
                completed: true,
                last_position: 0,
            });

            if (error) throw error;

            setProgress((prev) => ({
                ...prev,
                [lessonId]: { lesson_id: lessonId, completed: true, last_position: 0 },
            }));

            toast.success('Lesson marked as complete!');

            // Auto-advance to next lesson
            const currentIndex = lessons.findIndex((l) => l.id === lessonId);
            if (currentIndex < lessons.length - 1) {
                setCurrentLesson(lessons[currentIndex + 1]);
            }
        } catch (error) {
            console.error('Error marking lesson complete:', error);
            toast.error('Failed to update progress');
        }
    };

    const getYouTubeId = (url: string) => {
        const match = url.match(
            /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?/]+)/
        );
        return match ? match[1] : null;
    };

    const completedLessons = lessons.filter((l) => progress[l.id]?.completed).length;
    const totalLessons = lessons.length;
    const courseProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="mb-4">Please sign in to access this course</p>
                        <Button onClick={() => navigate('/auth')}>Sign In</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container-custom py-8">
                    <Skeleton className="h-96 mb-4" />
                    <div className="grid lg:grid-cols-4 gap-6">
                        <Skeleton className="h-64 lg:col-span-3" />
                        <Skeleton className="h-96" />
                    </div>
                </div>
            </div>
        );
    }

    if (!course || !isEnrolled) {
        return null;
    }

    const youtubeId = currentLesson?.video_url
        ? getYouTubeId(currentLesson.video_url)
        : null;

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title={`Learn ${course.title} - Zymios`}
                description={course.description || ''}
                url={`/learn/${slug}`}
            />

            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link to="/dashboard">
                                    <Home className="w-4 h-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="font-semibold text-sm md:text-base line-clamp-1">
                                    {course.title}
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    {completedLessons} of {totalLessons} lessons completed
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block w-32">
                                <Progress value={courseProgress} className="h-2" />
                            </div>
                            <span className="text-sm font-medium">{Math.round(courseProgress)}%</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Archived course notice — enrolled students keep full access */}
            {isArchived && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm px-4 py-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>This course has been archived. As an enrolled student, you still have full access to all lessons and resources.</span>
                </div>
            )}

            <main className="container-custom py-6">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Video Player */}
                        <Card>
                            <CardContent className="p-0">
                                {currentLesson ? (
                                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                        {youtubeId ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                                                title={currentLesson.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white">
                                                <div className="text-center">
                                                    <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                    <p>No video available for this lesson</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-muted flex items-center justify-center">
                                        <p className="text-muted-foreground">Select a lesson to start learning</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Lesson Info */}
                        {currentLesson && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                                            {currentLesson.description && (
                                                <p className="text-muted-foreground">{currentLesson.description}</p>
                                            )}
                                        </div>
                                        {!progress[currentLesson.id]?.completed && (
                                            <Button
                                                onClick={() => markLessonComplete(currentLesson.id)}
                                                className="ml-4"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark Complete
                                            </Button>
                                        )}
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            disabled={lessons.findIndex((l) => l.id === currentLesson.id) === 0}
                                            onClick={() => {
                                                const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
                                                if (currentIndex > 0) setCurrentLesson(lessons[currentIndex - 1]);
                                            }}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Previous
                                        </Button>
                                        <Button
                                            disabled={
                                                lessons.findIndex((l) => l.id === currentLesson.id) ===
                                                lessons.length - 1
                                            }
                                            onClick={() => {
                                                const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
                                                if (currentIndex < lessons.length - 1)
                                                    setCurrentLesson(lessons[currentIndex + 1]);
                                            }}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Lesson List */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Course Content
                                </h3>
                                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                                    {lessons.map((lesson, index) => {
                                        const isCompleted = progress[lesson.id]?.completed;
                                        const isCurrent = currentLesson?.id === lesson.id;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setCurrentLesson(lesson)}
                                                className={`w-full text-left p-3 rounded-lg transition-colors ${isCurrent
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-secondary'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5">
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                        ) : isCurrent ? (
                                                            <PlayCircle className="w-5 h-5" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 opacity-50" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium line-clamp-2">{lesson.title}</p>
                                                        {lesson.duration_minutes && (
                                                            <p className="text-xs opacity-70 mt-1">
                                                                {Math.floor(lesson.duration_minutes / 60)}h {lesson.duration_minutes % 60}m
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LearnPage;
