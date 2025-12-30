// Live Session Management Types

export interface LiveSession {
    id: string;
    course_id: string;
    instructor_id: string | null;
    title: string;
    description: string | null;
    session_number: number | null;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    timezone: string;
    duration_minutes: number | null;
    is_recurring: boolean;
    recurrence_pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom' | null;
    recurrence_end_date: string | null;
    parent_session_id: string | null;
    meeting_platform: 'zoom' | 'google_meet' | 'microsoft_teams' | 'other' | null;
    meeting_link: string | null;
    meeting_id: string | null;
    meeting_passcode: string | null;
    recording_drive_link: string | null;
    recording_added_at: string | null;
    recording_added_by: string | null;
    notification_sent: boolean;
    reminder_24h_sent: boolean;
    reminder_1h_sent: boolean;
    status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by: string | null;
}

export interface LiveSessionWithDetails extends LiveSession {
    course?: {
        id: string;
        title: string;
        slug: string;
    };
    instructor?: {
        id: string;
        full_name: string;
        email: string;
    };
    enrollments_count?: number;
}

export interface SessionQA {
    id: string;
    session_id: string;
    user_id: string;
    question_type: 'question' | 'feedback' | 'comment';
    content: string;
    instructor_response: string | null;
    responded_by: string | null;
    responded_at: string | null;
    is_answered: boolean;
    is_pinned: boolean;
    upvotes: number;
    created_at: string;
    updated_at: string;
}

export interface SessionQAWithUser extends SessionQA {
    user?: {
        id: string;
        full_name: string;
        email: string;
    };
    responder?: {
        id: string;
        full_name: string;
    };
}

export interface NotificationPreferences {
    id: string;
    user_id: string;
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
    reminder_24h_before: boolean;
    reminder_1h_before: boolean;
    reminder_15m_before: boolean;
    session_created: boolean;
    session_updated: boolean;
    session_cancelled: boolean;
    new_qa_response: boolean;
    recording_available: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateSessionData {
    course_id: string;
    title: string;
    description?: string;
    session_number?: number;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    timezone: string;
    meeting_platform: 'zoom' | 'google_meet' | 'microsoft_teams' | 'other';
    meeting_link: string;
    meeting_id?: string;
    meeting_passcode?: string;
    is_recurring?: boolean;
    recurrence_pattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
    recurrence_end_date?: string;
    status?: 'draft' | 'scheduled';
}

export interface RecurringSessionData extends CreateSessionData {
    is_recurring: true;
    recurrence_pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
    recurrence_end_date: string;
    occurrences?: number;
}

export interface SessionValidationErrors {
    title?: string;
    course?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    meetingLink?: string;
    recurrenceEndDate?: string;
}
