/**
 * Shared utility functions for Course management
 * Used by both Admin and Instructor course editors
 */

import type { CourseFormData } from '@/types/course';

/**
 * Generate a URL-friendly slug from a title
 */
export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

/**
 * Get default form data for a new course
 */
export const getDefaultFormData = (): CourseFormData => ({
    title: '',
    slug: '',
    description: '',
    poster_url: '',
    promo_video_url: '',
    course_type: 'recorded',
    difficulty: '',
    status: 'draft',
    featured: false,
    upcoming: false,
    certificate: true,
    price_regular: '',
    price_offer: '',
    start_date: undefined,
    duration_text: '',
    module_count: '',
    instructor_id: '',
    instructor_name: '',
    instructor_title: '',
    instructor_bio: '',
    instructor_photo: '',
    learning_outcomes: [''],
    requirements: [''],
    topics: [''],
    comparison_features: [{ feature: '', us: true, others: false }],
    target_audience: [{ title: '', description: '', icon: 'GraduationCap' }],
    testimonials: [{ name: '', role: '', text: '', video_url: '', rating: 5 }],
    value_breakdown: [{ item: '', original_price: '', is_premium: false, sub_text: '' }],
    countdown_end_date: undefined,
    stats: { students: '', community: '', support: '' },
    faq: [{ question: '', answer: '' }],
    whats_included: [''],
    modules: [{ title: '', subtitle: '', description: '', icon: 'Database' }],
    payment_methods: [],
    payment_instructions: '',
    enrollment_form_fields: [],
});
