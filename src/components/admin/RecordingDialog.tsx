import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Link as LinkIcon, Check } from 'lucide-react';

interface RecordingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: string;
    sessionTitle: string;
    onSuccess: () => void;
}

export const RecordingDialog = ({
    open,
    onOpenChange,
    sessionId,
    sessionTitle,
    onSuccess,
}: RecordingDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [recordingLink, setRecordingLink] = useState('');
    const [error, setError] = useState('');

    const validateGoogleDriveLink = (url: string): boolean => {
        if (!url.trim()) {
            setError('Recording link is required');
            return false;
        }

        try {
            const urlObj = new URL(url);
            if (!urlObj.hostname.includes('drive.google.com')) {
                setError('Please enter a valid Google Drive link');
                return false;
            }
            setError('');
            return true;
        } catch {
            setError('Please enter a valid URL');
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!validateGoogleDriveLink(recordingLink)) return;

        try {
            setLoading(true);

            const { error: updateError } = await supabase
                .from('live_sessions')
                .update({
                    recording_drive_link: recordingLink,
                    recording_added_at: new Date().toISOString(),
                })
                .eq('id', sessionId);

            if (updateError) throw updateError;

            toast.success('Recording link added successfully! Students will be notified.');
            onSuccess();
            onOpenChange(false);
            setRecordingLink('');
            setError('');
        } catch (error: any) {
            console.error('Error adding recording:', error);
            toast.error(error.message || 'Failed to add recording link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Recording Link</DialogTitle>
                    <DialogDescription>
                        Add Google Drive link for: <strong>{sessionTitle}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="recording_link">Google Drive Link *</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="recording_link"
                                type="url"
                                placeholder="https://drive.google.com/file/d/... or folder link"
                                value={recordingLink}
                                onChange={(e) => {
                                    setRecordingLink(e.target.value);
                                    setError('');
                                }}
                                className="pl-10"
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <p className="text-xs text-muted-foreground">
                            💡 Make sure the link is set to "Anyone with the link can view"
                        </p>
                    </div>

                    <div className="bg-muted p-3 rounded-lg space-y-2">
                        <p className="text-sm font-medium">What happens next:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>✓ Recording link will be saved</li>
                            <li>✓ Enrolled students will be notified via email</li>
                            <li>✓ Students can access the recording from their dashboard</li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            setRecordingLink('');
                            setError('');
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Save & Notify Students
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
