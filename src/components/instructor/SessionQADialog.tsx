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
import { MessageCircle, ThumbsUp, CheckCircle, Reply } from 'lucide-react';
import { toast } from 'sonner';

interface SessionQADialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: string;
    sessionTitle: string;
}

export const SessionQADialog = ({
    open,
    onOpenChange,
    sessionId,
    sessionTitle,
}: SessionQADialogProps) => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<SessionQA[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

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
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (questionId: string) => {
        if (!replyText[questionId]?.trim()) return;

        try {
            const { error } = await supabase
                .from('session_qa')
                .update({
                    instructor_response: replyText[questionId],
                    responded_by: user?.id,
                    responded_at: new Date().toISOString(),
                    is_answered: true
                })
                .eq('id', questionId);

            if (error) throw error;

            toast.success('Reply posted successfully');
            setReplyingTo(null);
            setReplyText(prev => {
                const newText = { ...prev };
                delete newText[questionId];
                return newText;
            });
            fetchQuestions();
        } catch (error) {
            console.error('Error posting reply:', error);
            toast.error('Failed to post reply');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Q&A - {sessionTitle}</DialogTitle>
                    <DialogDescription>
                        View and respond to questions from students.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground py-8">Loading questions...</p>
                        ) : questions.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center text-muted-foreground">
                                <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                                <p>No questions yet.</p>
                            </div>
                        ) : (
                            questions.map((q) => (
                                <div key={q.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                                {(q.user as any)?.full_name?.[0] || 'U'}
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
                                            <div className="flex items-center text-muted-foreground text-xs bg-secondary/50 px-2 py-1 rounded">
                                                <ThumbsUp className="w-3 h-3 mr-1" /> {q.upvotes || 0}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm">{q.content}</p>

                                    {q.instructor_response ? (
                                        <div className="bg-muted p-3 rounded-md text-sm ml-4 border-l-2 border-primary">
                                            <p className="font-semibold text-xs text-primary mb-1">Instructor Response</p>
                                            <p>{q.instructor_response}</p>
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                            {!replyingTo || replyingTo !== q.id ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary h-auto p-0 hover:bg-transparent hover:underline"
                                                    onClick={() => setReplyingTo(q.id)}
                                                >
                                                    <Reply className="w-3 h-3 mr-1" /> Reply
                                                </Button>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        placeholder="Type your answer..."
                                                        className="min-h-[80px]"
                                                        value={replyText[q.id] || ''}
                                                        onChange={(e) => setReplyText({ ...replyText, [q.id]: e.target.value })}
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                                        <Button size="sm" onClick={() => handleReply(q.id)}>Post Reply</Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
