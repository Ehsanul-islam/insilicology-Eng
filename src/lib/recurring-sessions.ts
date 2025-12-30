import { addDays, addWeeks, addMonths, format } from 'date-fns';
import { CreateSessionData } from '@/types/live-sessions';

export interface RecurringSessionPreview {
    date: string;
    startTime: string;
    endTime: string;
    displayText: string;
}

export const generateRecurringDates = (
    startDate: string,
    pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom',
    endDate: string
): string[] => {
    if (pattern === 'custom') {
        return [startDate];
    }

    const dates: string[] = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    while (currentDate <= finalDate) {
        dates.push(format(currentDate, 'yyyy-MM-dd'));

        switch (pattern) {
            case 'daily':
                currentDate = addDays(currentDate, 1);
                break;
            case 'weekly':
                currentDate = addWeeks(currentDate, 1);
                break;
            case 'biweekly':
                currentDate = addWeeks(currentDate, 2);
                break;
            case 'monthly':
                currentDate = addMonths(currentDate, 1);
                break;
        }
    }

    return dates;
};

export const createRecurringSessions = async (
    supabase: any,
    baseData: CreateSessionData,
    pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom',
    endDate: string
): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
        const dates = generateRecurringDates(baseData.scheduled_date, pattern, endDate);

        if (dates.length > 50) {
            return {
                success: false,
                count: 0,
                error: 'Too many sessions (max 50). Please choose a shorter date range.',
            };
        }

        // Create parent session first
        const parentData = {
            ...baseData,
            is_recurring: true,
            recurrence_pattern: pattern,
            recurrence_end_date: endDate,
        };

        const { data: parentSession, error: parentError } = await supabase
            .from('live_sessions')
            .insert(parentData)
            .select()
            .single();

        if (parentError) throw parentError;

        // Create child sessions
        const childSessions = dates.slice(1).map((date, index) => ({
            ...baseData,
            scheduled_date: date,
            session_number: index + 2,
            is_recurring: true,
            recurrence_pattern: pattern,
            parent_session_id: parentSession.id,
            title: `${baseData.title} - Session ${index + 2}`,
        }));

        if (childSessions.length > 0) {
            const { error: childError } = await supabase
                .from('live_sessions')
                .insert(childSessions);

            if (childError) throw childError;
        }

        return {
            success: true,
            count: dates.length,
        };
    } catch (error: any) {
        console.error('Error creating recurring sessions:', error);
        return {
            success: false,
            count: 0,
            error: error.message || 'Failed to create recurring sessions',
        };
    }
};

export const getRecurringPreview = (
    startDate: string,
    startTime: string,
    endTime: string,
    pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom',
    endDate: string
): RecurringSessionPreview[] => {
    const dates = generateRecurringDates(startDate, pattern, endDate);

    return dates.slice(0, 10).map((date, index) => ({
        date,
        startTime,
        endTime,
        displayText: `Session ${index + 1}: ${format(new Date(date), 'MMM dd, yyyy')} at ${startTime} - ${endTime}`,
    }));
};
