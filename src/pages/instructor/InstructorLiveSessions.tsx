import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Video, Calendar, Clock, ExternalLink, MessageCircle } from 'lucide-react';
import { format, isPast, addMinutes, parseISO } from 'date-fns';
import { LiveSessionWithDetails } from '@/types/live-sessions';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionQADialog } from '@/components/instructor/SessionQADialog';

const InstructorLiveSessions = () => {
    const { user } = useAuth();
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
            // Fetch sessions where the course instructor is the current user
            const { data, error } = await supabase
                .from('live_sessions')
                .select(`
          *,
          course:courses(id, title, slug, instructor_id)
        `)
                .order('scheduled_date', { ascending: true })
                .order('start_time', { ascending: true });

            if (error) throw error;

            // Filter locally for now effectively or rely on RLS if configured to show only instructor's courses
            // Since RLS for 'select' might be broad, we double check ownership if needed.
            // However, assuming the query returns what the user is allowed to see.
            // Let's manually filter to be safe if RLS allows reading all sessions (which it might for admins/instructors).
            // Actually, my RLS plan said "Instructors can view sessions for their own courses."

            const mySessions = data?.filter((session: any) => session.course?.instructor_id === user?.id) || [];
            setSessions(mySessions);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSessionStatus = (session: LiveSessionWithDetails) => {
        const startDateTime = parseISO(`${session.scheduled_date}T${session.start_time}`);
        const endDateTime = parseISO(`${session.scheduled_date}T${session.end_time}`);
        const now = new Date();

        if (session.status === 'completed') return 'completed';
        if (session.status === 'cancelled') return 'cancelled';

        if (now > endDateTime) return 'completed'; // Auto-detect completion logic if status isn't updated
        if (now >= addMinutes(startDateTime, -15) && now <= endDateTime) return 'live';

        return 'upcoming';
    };

    const canJoinSession = (session: LiveSessionWithDetails) => {
        const status = getSessionStatus(session);
        return status === 'live' || status === 'ongoing';
    };

    const upcomingSessions = sessions.filter(s => {
        const status = getSessionStatus(s);
        return status === 'upcoming' || status === 'live' || s.status === 'ongoing';
    });

    const pastSessions = sessions.filter(s => {
        const status = getSessionStatus(s);
        return status === 'completed' || s.status === 'completed';
    }).sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());

    const handleOpenQA = (session: LiveSessionWithDetails) => {
        setSelectedSession({ id: session.id, title: session.title });
        setQaOpen(true);
    };

    const renderSessionCard = (session: LiveSessionWithDetails, isPast: boolean) => {
        const status = getSessionStatus(session);
        const joinable = canJoinSession(session);

        return (
            <Card key={session.id} className="mb-4">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{session.title}</h3>
                                {status === 'live' && (
                                    <Badge variant="destructive" className="animate-pulse">
                                        🔴 Live Now
                                    </Badge>
                                )}
                                {status === 'upcoming' && <Badge variant="secondary">Upcoming</Badge>}
                                {status === 'completed' && <Badge variant="outline">Completed</Badge>}
                            </div>

                            <div className="text-sm text-muted-foreground flex flex-col md:flex-row gap-2 md:gap-4">
                                <span className="flex items-center gap-1">
                                    <Video className="w-4 h-4" />
                                    {session.course?.title}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {format(parseISO(session.scheduled_date), 'MMM dd, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {format(parseISO(`${session.scheduled_date}T${session.start_time}`), 'h:mm a')} - {format(parseISO(`${session.scheduled_date}T${session.end_time}`), 'h:mm a')}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {!isPast ? (
                                <Button
                                    className="w-full md:w-auto"
                                    disabled={!joinable}
                                    onClick={() => window.open(session.meeting_link || '', '_blank')}
                                >
                                    {joinable ? (
                                        <>
                                            <Video className="w-4 h-4 mr-2" />
                                            Join Session
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Starts {format(parseISO(`${session.scheduled_date}T${session.start_time}`), 'h:mm a')}
                                        </>
                                    )}
                                </Button>
                            ) : (
                                session.recording_drive_link && (
                                    <Button variant="outline" className="w-full md:w-auto" asChild>
                                        <a href={session.recording_drive_link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View Recording
                                        </a>
                                    </Button>
                                )
                            )}
                            <Button variant="secondary" onClick={() => handleOpenQA(session)}>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Q&A
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Live Sessions</h1>
                <p className="text-muted-foreground">Manage your interactive classes and view upcoming schedules.</p>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
                    <TabsTrigger value="past">Past ({pastSessions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                    {upcomingSessions.length > 0 ? (
                        upcomingSessions.map(session => renderSessionCard(session, false))
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                                <p>No upcoming sessions scheduled.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="past" className="mt-6">
                    {pastSessions.length > 0 ? (
                        pastSessions.map(session => renderSessionCard(session, true))
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Clock className="w-12 h-12 mb-4 opacity-50" />
                                <p>No past sessions found.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {selectedSession && (
                <SessionQADialog
                    open={qaOpen}
                    onOpenChange={setQaOpen}
                    sessionId={selectedSession.id}
                    sessionTitle={selectedSession.title}
                />
            )}
        </div>
    );
};

export default InstructorLiveSessions;
