/**
 * Shared type definitions for Course management
 * Used by both Admin and Instructor course editors
 */

// Sub-interfaces - exported for use in components
export interface ComparisonFeature {
  feature: string;
  us: boolean;
  others: boolean;
}

export interface TargetAudienceCard {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  video_url: string;
  rating: number;
}

export interface ValueItem {
  item: string;
  original_price: string;
  is_premium?: boolean;
  sub_text?: string;
}

export interface EnrollmentFormField {
  id: string;
  label: string;
  type: 'text' | 'phone' | 'email' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ModuleItem {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  /** When true, module is marketed as Early Bird exclusive; lesson list may be hidden for non–Early Bird enrollments. */
  early_bird_only?: boolean;
}

// Main CourseFormData interface
export interface CourseFormData {
  // Basic Info
  title: string;
  slug: string;
  description: string;
  poster_url: string;
  promo_video_url: string;
  course_type: 'live' | 'recorded' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  upcoming: boolean;
  certificate: boolean;
  price_regular: string;

  price_offer: string;
  early_bird_price: string;
  early_bird_limit: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
  duration_text: string;
  module_count: string;

  // Instructor
  instructor_id: string;
  instructor_name: string;
  instructor_title: string;
  instructor_bio: string;
  instructor_photo: string;

  // Content
  learning_outcomes: string[];
  requirements: string[];
  topics: string[];

  // Marketing
  comparison_features: ComparisonFeature[];
  target_audience: TargetAudienceCard[];
  testimonials: Testimonial[];
  value_breakdown: ValueItem[];
  countdown_end_date: Date | undefined;
  stats: {
    students: string;
    community: string;
    support: string;
    time?: string;
    capacity?: string;
    batch?: string;
    fakeEnrollmentPadding?: string;
    genuineThreshold?: string;
  };

  // Marketing - FAQ
  faq: FAQItem[];
  whats_included: string[];

  // Curriculum - Modules
  modules: ModuleItem[];

  // Enrollment
  payment_methods: string[];
  payment_instructions: string;
  enrollment_form_fields: EnrollmentFormField[];
  payment_link?: string;
  payment_qr_code_url?: string;
}
