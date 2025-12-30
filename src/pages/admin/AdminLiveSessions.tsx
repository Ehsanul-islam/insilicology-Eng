import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Copy,
    Video as VideoIcon,
    Calendar as CalendarIcon,
    Search,
    Filter,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { LiveSessionWithDetails } from '@/types/live-sessions';
import { format, parseISO } from 'date-fns';
import { CreateSessionDialog } from '@/components/admin/CreateSessionDialog';
import { RecordingDialog } from '@/components/admin/RecordingDialog';

const AdminLiveSessions = () => {
    const [sessions, setSessions] = useState<LiveSessionWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    const [courses, setCourses] = useState<any[]>([]);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [recordingDialogOpen, setRecordingDialogOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<LiveSessionWithDetails | null>(null);

    useEffect(() => {
        loadSessions();
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('id, title')
                .eq('course_type', 'live')
                .order('title');

            if (error) throw error;
            setCourses(data || []);
        } catch (error: any) {
            console.error('Error loading courses:', error);
        }
    };

    const loadSessions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('live_sessions')
                .select(`
          *,
          course:courses(id, title, slug),
          instructor:profiles!live_sessions_instructor_id_fkey(id, full_name, email)
        `)
                .order('scheduled_date', { ascending: false })
                .order('start_time', { ascending: false });

            if (error) throw error;
            setSessions(data || []);
        } catch (error: any) {
            console.error('Error loading sessions:', error);
            toast.error('Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            draft: { variant: 'secondary', label: 'Draft' },
            scheduled: { variant: 'default', label: 'Scheduled' },
            ongoing: { variant: 'destructive', label: 'Ongoing' },
            completed: { variant: 'outline', label: 'Completed' },
            cancelled: { variant: 'secondary', label: 'Cancelled' },
        };

        const config = variants[status] || variants.draft;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getPlatformBadge = (platform: string | null) => {
        if (!platform) return null;

        const icons: Record<string, string> = {
            zoom: '🎥',
            google_meet: '📹',
            microsoft_teams: '💼',
            other: '🔗',
        };

        return (
            <span className="flex items-center gap-1 text-sm">
                <span>{icons[platform]}</span>
                <span className="capitalize">{platform.replace('_', ' ')}</span>
            </span>
        );
    };

    const formatDateTime = (date: string, time: string) => {
        try {
            const dateObj = parseISO(date);
            return `${format(dateObj, 'MMM dd, yyyy')} at ${time}`;
        } catch {
            return `${date} at ${time}`;
        }
    };

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        toast.success('Meeting link copied to clipboard');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this session?')) return;

        try {
            const { error } = await supabase
                .from('live_sessions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Session deleted successfully');
            loadSessions();
        } catch (error: any) {
            console.error('Error deleting session:', error);
            toast.error('Failed to delete session');
        }
    };

    const handleAddRecording = (session: LiveSessionWithDetails) => {
        setSelectedSession(session);
        setRecordingDialogOpen(true);
    };

    // Filter sessions
    const filteredSessions = sessions.filter((session) => {
        const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
        const matchesCourse = courseFilter === 'all' || session.course_id === courseFilter;

        return matchesSearch && matchesStatus && matchesCourse;
    });

    return (
        <AdminLayout>
            <SEOHead
                title="Live Sessions | Admin"
                description="Manage live sessions for courses"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage live sessions, schedules, and recordings
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Session
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search sessions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={courseFilter} onValueChange={setCourseFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="All Courses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sessions Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Session</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Loading sessions...
                                    </TableCell>
                                </TableRow>
                            ) : filteredSessions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <VideoIcon className="w-12 h-12 text-muted-foreground" />
                                            <p className="text-muted-foreground">No sessions found</p>
                                            <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create First Session
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{session.title}</div>
                                                {session.session_number && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Session #{session.session_number}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{session.course?.title || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {formatDateTime(session.scheduled_date, session.start_time)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {session.duration_minutes ? `${session.duration_minutes} min` : ''}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getPlatformBadge(session.meeting_platform)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(session.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {session.meeting_link && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleCopyLink(session.meeting_link!)}
                                                        >
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Copy Link
                                                        </DropdownMenuItem>
                                                    )}
                                                    {session.status === 'completed' && !session.recording_drive_link && (
                                                        <DropdownMenuItem onClick={() => handleAddRecording(session)}>
                                                            <VideoIcon className="w-4 h-4 mr-2" />
                                                            Add Recording
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(session.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Total Sessions</div>
                        <div className="text-2xl font-bold">{sessions.length}</div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Scheduled</div>
                        <div className="text-2xl font-bold">
                            {sessions.filter((s) => s.status === 'scheduled').length}
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Completed</div>
                        <div className="text-2xl font-bold">
                            {sessions.filter((s) => s.status === 'completed').length}
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">With Recordings</div>
                        <div className="text-2xl font-bold">
                            {sessions.filter((s) => s.recording_drive_link).length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Session Dialog */}
            <CreateSessionDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={loadSessions}
            />

            {/* Recording Dialog */}
            {selectedSession && (
                <RecordingDialog
                    open={recordingDialogOpen}
                    onOpenChange={setRecordingDialogOpen}
                    sessionId={selectedSession.id}
                    sessionTitle={selectedSession.title}
                    onSuccess={loadSessions}
                />
            )}
        </AdminLayout>
    );
};

export default AdminLiveSessions;
