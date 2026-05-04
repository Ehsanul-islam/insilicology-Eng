import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { StudentQADialog } from '@/components/student/StudentQADialog';
import { Loader2, Video, Calendar, Clock, ExternalLink, GraduationCap, Settings, LogOut, BookOpen, ChevronLeft, MessageCircle } from 'lucide-react';
import { format, isPast, addMinutes, parseISO } from 'date-fns';
import { LiveSessionWithDetails } from '@/types/live-sessions';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

const StudentLiveSessions = () => {
    const { user, signOut } = useAuth();
    const [sessions, setSessions] = useState<LiveSessionWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [qaOpen, setQaOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<{ id: string, title: string } | null>(null);

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user]);

    const fetchSessions = async () => {
        try {
            setLoading(true);

            // 1. Get enrolled course IDs
            const { data: enrollments, error: enrollmentsError } = await supabase
                .from('enrollments')
                .select('course_id')
                .eq('student_id', user?.id)
                .eq('status', 'active'); // Assuming active enrollments

            if (enrollmentsError) throw enrollmentsError;

            const courseIds = enrollments.map(e => e.course_id);

            if (courseIds.length === 0) {
                setSessions([]);
                setLoading(false);
                return;
            }

            // 2. Fetch sessions for these courses
            const { data, error } = await supabase
                .from('live_sessions')
                .select(`
          *,
          course:courses(id, title, slug)
        `)
                .in('course_id', courseIds)
                .eq('is_active', true)
                .neq('status', 'cancelled')
                .order('scheduled_date', { ascending: true })
                .order('start_time', { ascending: true });

            if (error) throw error;
            setSessions(data || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenQA = (session: LiveSessionWithDetails) => {
        setSelectedSession({ id: session.id, title: session.title });
        setQaOpen(true);
    };

    const getSessionStatus = (session: LiveSessionWithDetails) => {
        // If status is explicitly completed (e.g. by instructor), trust it.
        if (session.status === 'completed') return 'completed';

        const startDateTime = parseISO(`${session.scheduled_date}T${session.start_time}`);
        const endDateTime = parseISO(`${session.scheduled_date}T${session.end_time}`);
        const now = new Date();

        // Auto-detect if it's live or past if status isn't updated manually
        if (now > endDateTime) return 'completed';
        if (now >= addMinutes(startDateTime, -15) && now <= endDateTime) return 'live';

        return 'upcoming';
    };

    const canJoinSession = (session: LiveSessionWithDetails) => {
        const status = getSessionStatus(session);
        return status === 'live' || session.status === 'ongoing';
    };

    const upcomingSessions = sessions.filter(s => {
        const status = getSessionStatus(s);
        return status === 'upcoming' || status === 'live';
    });

    const pastSessions = sessions.filter(s => {
        const status = getSessionStatus(s);
        return status === 'completed';
    }).sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());

    const renderSessionCard = (session: LiveSessionWithDetails, isPast: boolean) => {
        const status = getSessionStatus(session);
        const joinable = canJoinSession(session);

        return (
            <Card key={session.id} className="mb-4 animate-fade-in hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                    <Video className="w-3 h-3 mr-1" />
                                    {session.course?.title}
                                </Badge>
                                {status === 'live' && (
                                    <Badge variant="destructive" className="animate-pulse">
                                        🔴 Live Now
                                    </Badge>
                                )}
                                {status === 'upcoming' && <Badge variant="secondary">Upcoming</Badge>}
                                {status === 'completed' && <Badge variant="outline">Completed</Badge>}
                            </div>

                            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{session.title}</h3>

                            <div className="text-sm text-muted-foreground flex flex-col sm:flex-row gap-2 sm:gap-6">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {format(parseISO(session.scheduled_date), 'EEEE, MMM dd, yyyy')}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {format(parseISO(`${session.scheduled_date}T${session.start_time}`), 'h:mm a')} - {format(parseISO(`${session.scheduled_date}T${session.end_time}`), 'h:mm a')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 md:pt-0">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleOpenQA(session)}
                                className="w-full md:w-auto"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Q&A
                            </Button>
                            {!isPast ? (
                                <Button
                                    className={`w-full md:w-auto transition-all ${joinable ? 'shadow-lg shadow-primary/25' : ''}`}
                                    disabled={!joinable}
                                    size="lg"
                                    onClick={() => window.open(session.meeting_link || '', '_blank')}
                                >
                                    {joinable ? (
                                        <>
                                            <Video className="w-4 h-4 mr-2" />
                                            Join Class
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Starts {format(parseISO(`${session.scheduled_date}T${session.start_time}`), 'h:mm a')}
                                        </>
                                    )}
                                </Button>
                            ) : (
                                session.recording_drive_link ? (
                                    <Button variant="default" className="w-full md:w-auto" asChild>
                                        <a href={session.recording_drive_link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Watch Recording
                                        </a>
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled className="w-full md:w-auto opacity-70">
                                        No Recording
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <SEOHead
                title="My Sessions - insilicology"
                description="Your schedule of upcoming live classes and past recordings."
                url="/my-sessions"
            />

            {/* Header with Navigation (Consistent with Dashboard) */}
            <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-500 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">insilicology</span>
                        </Link>

                        <nav className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                                <Link to="/courses">Browse Courses</Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link to="/profile/settings">
                                    <Settings className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={signOut}>
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Button variant="ghost" size="sm" asChild className="-ml-3 h-8 px-2 text-muted-foreground">
                                <Link to="/dashboard">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">My Live Sessions</h1>
                        <p className="text-muted-foreground">Manage your upcoming classes and access course recordings.</p>
                    </div>

                    <Badge variant="outline" className="px-3 py-1 text-base font-medium">
                        {upcomingSessions.length} Upcoming
                    </Badge>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        <div className="flex gap-4 mb-6">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                ) : (
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
                            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                            <TabsTrigger value="past">Past / Recordings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className="space-y-4">
                            {upcomingSessions.length > 0 ? (
                                upcomingSessions.map(session => renderSessionCard(session, false))
                            ) : (
                                <Card className="bg-white/50 dark:bg-slate-900/50">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                            <Calendar className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No scheduled sessions</h3>
                                        <p className="mb-6 max-w-sm text-center">You don't have any upcoming live sessions for your enrolled courses.</p>
                                        <Button asChild>
                                            <Link to="/courses">Browse Courses</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="space-y-4">
                            {pastSessions.length > 0 ? (
                                pastSessions.map(session => renderSessionCard(session, true))
                            ) : (
                                <Card className="bg-white/50 dark:bg-slate-900/50">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                            <Video className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No past sessions</h3>
                                        <p>You haven't attended any sessions yet.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>

            <StudentQADialog
                open={qaOpen}
                onOpenChange={setQaOpen}
                sessionId={selectedSession?.id || ''}
                sessionTitle={selectedSession?.title || ''}
            />
        </div>
    );
};

export default StudentLiveSessions;
