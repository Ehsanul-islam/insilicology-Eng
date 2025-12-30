import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SessionQA } from '@/types/live-sessions';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ThumbsUp, CheckCircle, Send, User } from 'lucide-react';
import { toast } from 'sonner';

interface StudentQADialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: string;
    sessionTitle: string;
}

export const StudentQADialog = ({
    open,
    onOpenChange,
    sessionId,
    sessionTitle,
}: StudentQADialogProps) => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<SessionQA[]>([]);
    const [loading, setLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open && sessionId) {
            fetchQuestions();
        }
    }, [open, sessionId]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('session_qa')
                .select(`
          *,
          user:profiles!session_qa_user_id_fkey(full_name, avatar_url)
        `)
                .eq('session_id', sessionId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuestions(data || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
            // toast.error('Failed to load questions'); // Silent fail is better for UX sometimes, or retry
        } finally {
            setLoading(false);
        }
    };

    const handlePostQuestion = async () => {
        if (!newQuestion.trim()) return;

        try {
            setSubmitting(true);
            const { error } = await supabase
                .from('session_qa')
                .insert({
                    session_id: sessionId,
                    user_id: user?.id,
                    content: newQuestion,
                    is_answered: false,
                    upvotes: 0
                });

            if (error) throw error;

            toast.success('Question posted successfully');
            setNewQuestion('');
            fetchQuestions(); // Refresh list
        } catch (error) {
            console.error('Error posting question:', error);
            toast.error('Failed to post question');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpvote = async (questionId: string, currentUpvotes: number) => {
        try {
            const { error } = await supabase
                .from('session_qa')
                .update({ upvotes: (currentUpvotes || 0) + 1 })
                .eq('id', questionId);

            if (error) throw error;

            // Optimistic update or refresh
            setQuestions(prev => prev.map(q =>
                q.id === questionId ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q
            ));
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Q&A - {sessionTitle}</DialogTitle>
                    <DialogDescription>
                        Ask questions and see answers from the instructor.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* Ask Question Input */}
                    <div className="bg-muted/30 p-4 rounded-lg border space-y-3 shrink-0">
                        <Textarea
                            placeholder="Type your question here..."
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="bg-white dark:bg-slate-950 min-h-[80px]"
                        />
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                onClick={handlePostQuestion}
                                disabled={!newQuestion.trim() || submitting}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {submitting ? 'Posting...' : 'Ask Question'}
                            </Button>
                        </div>
                    </div>

                    <div className="relative flex-1 min-h-0">
                        <div className="absolute font-semibold text-sm text-muted-foreground mb-2 sticky top-0 bg-background z-10 py-2 w-full border-b">
                            Recent Questions ({questions.length})
                        </div>
                        <ScrollArea className="h-full pr-4 pb-4">
                            <div className="space-y-4 pt-2">
                                {loading ? (
                                    <p className="text-center text-muted-foreground py-8">Loading questions...</p>
                                ) : questions.length === 0 ? (
                                    <div className="text-center py-12 flex flex-col items-center text-muted-foreground">
                                        <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                                        <p>No questions yet. Be the first to ask!</p>
                                    </div>
                                ) : (
                                    questions.map((q) => (
                                        <div key={q.id} className="border rounded-lg p-4 space-y-3 bg-card">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{(q.user as any)?.full_name || 'Student'}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {q.is_answered && (
                                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                            <CheckCircle className="w-3 h-3 mr-1" /> Answered
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-muted-foreground hover:text-primary"
                                                        onClick={() => handleUpvote(q.id, q.upvotes || 0)}
                                                    >
                                                        <ThumbsUp className="w-3 h-3 mr-1" /> {q.upvotes || 0}
                                                    </Button>
                                                </div>
                                            </div>

                                            <p className="text-sm font-medium">{q.content}</p>

                                            {q.instructor_response && (
                                                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md text-sm ml-4 border-l-2 border-primary animate-fade-in">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Instructor</Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {q.responded_at && formatDistanceToNow(new Date(q.responded_at), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-foreground">{q.instructor_response}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
