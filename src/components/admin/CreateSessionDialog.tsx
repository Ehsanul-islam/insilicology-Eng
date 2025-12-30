import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateSessionData, SessionValidationErrors } from '@/types/live-sessions';
import { ChevronLeft, ChevronRight, Check, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { createRecurringSessions, getRecurringPreview } from '@/lib/recurring-sessions';

interface CreateSessionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const TIMEZONES = [
    { value: 'Asia/Dhaka', label: 'Asia/Dhaka (GMT+6)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
];

export const CreateSessionDialog = ({ open, onOpenChange, onSuccess }: CreateSessionDialogProps) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [errors, setErrors] = useState<SessionValidationErrors>({});

    const [formData, setFormData] = useState<Partial<CreateSessionData>>({
        timezone: 'Asia/Dhaka',
        meeting_platform: 'zoom',
        status: 'scheduled',
        is_recurring: false,
    });

    // Load courses when dialog opens
    useEffect(() => {
        if (open) {
            loadCourses();
        }
    }, [open]);

    const loadCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('id, title, instructor_id, instructor_name')
                .eq('course_type', 'live')
                .eq('status', 'published')
                .order('title');

            if (error) throw error;
            setCourses(data || []);
        } catch (error: any) {
            console.error('Error loading courses:', error);
            toast.error('Failed to load courses');
        }
    };

    const validateStep1 = (): boolean => {
        const newErrors: SessionValidationErrors = {};

        if (!formData.course_id) newErrors.course = 'Please select a course';
        if (!formData.title?.trim()) newErrors.title = 'Session title is required';
        if (!formData.scheduled_date) newErrors.date = 'Session date is required';
        if (!formData.start_time) newErrors.startTime = 'Start time is required';
        if (!formData.end_time) newErrors.endTime = 'End time is required';

        if (formData.scheduled_date) {
            const selectedDate = new Date(formData.scheduled_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date = 'Cannot schedule sessions in the past';
            }
        }

        if (formData.start_time && formData.end_time) {
            if (formData.start_time >= formData.end_time) {
                newErrors.endTime = 'End time must be after start time';
            }

            // Calculate duration
            const [startHour, startMin] = formData.start_time.split(':').map(Number);
            const [endHour, endMin] = formData.end_time.split(':').map(Number);
            const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

            if (duration > 240) {
                newErrors.duration = 'Session cannot exceed 4 hours';
            }
        }

        // Validate recurring session
        if (formData.is_recurring) {
            if (!formData.recurrence_pattern) {
                newErrors.recurrenceEndDate = 'Please select a recurrence pattern';
            }
            if (!formData.recurrence_end_date) {
                newErrors.recurrenceEndDate = 'Please select an end date for recurring sessions';
            } else if (formData.scheduled_date && formData.recurrence_end_date <= formData.scheduled_date) {
                newErrors.recurrenceEndDate = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: SessionValidationErrors = {};

        if (!formData.meeting_link?.trim()) {
            newErrors.meetingLink = 'Meeting link is required';
        } else {
            try {
                new URL(formData.meeting_link);
            } catch {
                newErrors.meetingLink = 'Please enter a valid URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const calculateDuration = () => {
        if (!formData.start_time || !formData.end_time) return null;
        const [startHour, startMin] = formData.start_time.split(':').map(Number);
        const [endHour, endMin] = formData.end_time.split(':').map(Number);
        return (endHour * 60 + endMin) - (startHour * 60 + startMin);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const selectedCourse = courses.find(c => c.id === formData.course_id);
            const duration = calculateDuration();

            const sessionData = {
                course_id: formData.course_id!,
                instructor_id: selectedCourse?.instructor_id,
                title: formData.title!,
                description: formData.description,
                scheduled_date: formData.scheduled_date!,
                start_time: formData.start_time!,
                end_time: formData.end_time!,
                timezone: formData.timezone!,
                duration_minutes: duration,
                meeting_platform: formData.meeting_platform!,
                meeting_link: formData.meeting_link!,
                meeting_id: formData.meeting_id,
                meeting_passcode: formData.meeting_passcode,
                status: formData.status!,
            };

            // Handle recurring sessions
            if (formData.is_recurring && formData.recurrence_pattern && formData.recurrence_end_date) {
                const result = await createRecurringSessions(
                    supabase,
                    sessionData,
                    formData.recurrence_pattern,
                    formData.recurrence_end_date
                );

                if (!result.success) {
                    throw new Error(result.error || 'Failed to create recurring sessions');
                }

                toast.success(`${result.count} recurring sessions created successfully!`);
            } else {
                // Single session
                const { error } = await supabase
                    .from('live_sessions')
                    .insert(sessionData);

                if (error) throw error;
                toast.success('Session created successfully!');
            }

            onSuccess();
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            console.error('Error creating session:', error);
            toast.error(error.message || 'Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            timezone: 'Asia/Dhaka',
            meeting_platform: 'zoom',
            status: 'scheduled',
            is_recurring: false,
        });
        setErrors({});
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                    value={formData.course_id}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                >
                    <SelectTrigger id="course">
                        <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                        {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.course && <p className="text-sm text-destructive">{errors.course}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                    id="title"
                    placeholder="e.g., Session 1: Introduction to React"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Session description..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                        id="date"
                        type="date"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        value={formData.scheduled_date || ''}
                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    />
                    {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                        value={formData.timezone}
                        onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                    >
                        <SelectTrigger id="timezone">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time *</Label>
                    <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time || ''}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                    {errors.startTime && <p className="text-sm text-destructive">{errors.startTime}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="end_time">End Time *</Label>
                    <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time || ''}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                    {errors.endTime && <p className="text-sm text-destructive">{errors.endTime}</p>}
                </div>
            </div>

            {calculateDuration() && (
                <div className="text-sm text-muted-foreground">
                    Duration: {Math.floor(calculateDuration()! / 60)}h {calculateDuration()! % 60}m
                </div>
            )}
            {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}

            {/* Recurring Session Options */}
            <div className="border-t pt-4 space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is_recurring"
                        checked={formData.is_recurring}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_recurring: checked as boolean })
                        }
                    />
                    <label htmlFor="is_recurring" className="text-sm font-medium">
                        Make this a recurring session
                    </label>
                </div>

                {formData.is_recurring && (
                    <div className="space-y-4 pl-6">
                        <div className="space-y-2">
                            <Label>Recurrence Pattern *</Label>
                            <Select
                                value={formData.recurrence_pattern}
                                onValueChange={(value: any) =>
                                    setFormData({ ...formData, recurrence_pattern: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select pattern" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recurrence_end_date">End Date *</Label>
                            <Input
                                id="recurrence_end_date"
                                type="date"
                                min={formData.scheduled_date || format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                                value={formData.recurrence_end_date || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, recurrence_end_date: e.target.value })
                                }
                            />
                            {errors.recurrenceEndDate && (
                                <p className="text-sm text-destructive">{errors.recurrenceEndDate}</p>
                            )}
                        </div>

                        {formData.scheduled_date &&
                            formData.start_time &&
                            formData.end_time &&
                            formData.recurrence_pattern &&
                            formData.recurrence_end_date && (
                                <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-sm font-medium mb-2">Preview:</p>
                                    <div className="space-y-1 text-xs text-muted-foreground max-h-32 overflow-y-auto">
                                        {getRecurringPreview(
                                            formData.scheduled_date,
                                            formData.start_time,
                                            formData.end_time,
                                            formData.recurrence_pattern,
                                            formData.recurrence_end_date
                                        ).map((preview, index) => (
                                            <div key={index}>{preview.displayText}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Meeting Platform *</Label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: 'zoom', label: 'Zoom', icon: '🎥' },
                        { value: 'google_meet', label: 'Google Meet', icon: '📹' },
                        { value: 'microsoft_teams', label: 'Teams', icon: '💼' },
                        { value: 'other', label: 'Other', icon: '🔗' },
                    ].map((platform) => (
                        <Button
                            key={platform.value}
                            type="button"
                            variant={formData.meeting_platform === platform.value ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => setFormData({ ...formData, meeting_platform: platform.value as any })}
                        >
                            <span className="mr-2">{platform.icon}</span>
                            {platform.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="meeting_link">Meeting Link *</Label>
                <Input
                    id="meeting_link"
                    type="url"
                    placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                    value={formData.meeting_link || ''}
                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                />
                {errors.meetingLink && <p className="text-sm text-destructive">{errors.meetingLink}</p>}
                <p className="text-xs text-muted-foreground">
                    💡 Students will see this link 30 minutes before the session starts
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="meeting_id">Meeting ID (Optional)</Label>
                    <Input
                        id="meeting_id"
                        placeholder="123-456-789"
                        value={formData.meeting_id || ''}
                        onChange={(e) => setFormData({ ...formData, meeting_id: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="meeting_passcode">Passcode (Optional)</Label>
                    <Input
                        id="meeting_passcode"
                        type="password"
                        placeholder="••••••"
                        value={formData.meeting_passcode || ''}
                        onChange={(e) => setFormData({ ...formData, meeting_passcode: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <div className="space-y-3">
                <Label>Notification Settings</Label>
                <p className="text-sm text-muted-foreground">
                    Enrolled students will be notified about this session
                </p>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="notify_create" defaultChecked disabled />
                        <label htmlFor="notify_create" className="text-sm">
                            Send email when session is created
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="notify_24h" defaultChecked disabled />
                        <label htmlFor="notify_24h" className="text-sm">
                            Reminder 24 hours before session
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="notify_1h" defaultChecked disabled />
                        <label htmlFor="notify_1h" className="text-sm">
                            Reminder 1 hour before session
                        </label>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                    ℹ️ Notification preferences will be implemented in Phase 5
                </p>
            </div>
        </div>
    );

    const renderStep4 = () => {
        const selectedCourse = courses.find(c => c.id === formData.course_id);
        const duration = calculateDuration();

        return (
            <div className="space-y-4">
                <div className="space-y-3">
                    <h3 className="font-semibold">Review Session Details</h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Course:</span>
                            <span className="font-medium">{selectedCourse?.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Title:</span>
                            <span className="font-medium">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                                {formData.scheduled_date && format(parseISO(formData.scheduled_date), 'MMM dd, yyyy')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-medium">
                                {formData.start_time} - {formData.end_time} ({formData.timezone})
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">
                                {duration && `${Math.floor(duration / 60)}h ${duration % 60}m`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Platform:</span>
                            <span className="font-medium capitalize">
                                {formData.meeting_platform?.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Meeting Link:</span>
                            <span className="font-medium text-xs truncate max-w-[200px]">
                                {formData.meeting_link}
                            </span>
                        </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg mt-4">
                        <p className="text-sm text-muted-foreground">
                            ⚠️ This will create a new session and notify enrolled students
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Live Session</DialogTitle>
                    <DialogDescription>
                        Step {step} of 4: {
                            step === 1 ? 'Course & Schedule' :
                                step === 2 ? 'Meeting Details' :
                                    step === 3 ? 'Notifications' :
                                        'Review & Confirm'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </div>

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={step === 1 || loading}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    {step < 4 ? (
                        <Button onClick={handleNext}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Create Session
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
