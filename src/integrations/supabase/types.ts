export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      career_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          email: string
          experience: string | null
          id: string
          name: string
          phone: string | null
          position: string
          resume_url: string | null
          updated_at: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          email: string
          experience?: string | null
          id?: string
          name: string
          phone?: string | null
          position: string
          resume_url?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          experience?: string | null
          id?: string
          name?: string
          phone?: string | null
          position?: string
          resume_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_data: Json | null
          certificate_number: string
          completion_date: string
          course_id: string | null
          course_name: string
          created_at: string | null
          download_count: number | null
          download_enabled: boolean | null
          downloaded_at: string | null
          enabled_at: string | null
          enabled_by: string | null
          id: string
          is_active: boolean | null
          issue_date: string | null
          recipient_name: string
          updated_at: string | null
          user_id: string | null
          verification_code: string | null
          verification_hash: string
        }
        Insert: {
          certificate_data?: Json | null
          certificate_number: string
          completion_date: string
          course_id?: string | null
          course_name: string
          created_at?: string | null
          download_count?: number | null
          download_enabled?: boolean | null
          downloaded_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_active?: boolean | null
          issue_date?: string | null
          recipient_name: string
          updated_at?: string | null
          user_id?: string | null
          verification_code?: string | null
          verification_hash: string
        }
        Update: {
          certificate_data?: Json | null
          certificate_number?: string
          completion_date?: string
          course_id?: string | null
          course_name?: string
          created_at?: string | null
          download_count?: number | null
          download_enabled?: boolean | null
          downloaded_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_active?: boolean | null
          issue_date?: string | null
          recipient_name?: string
          updated_at?: string | null
          user_id?: string | null
          verification_code?: string | null
          verification_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["contact_status"] | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          subject?: string | null
        }
        Relationships: []
      }
      course_batches: {
        Row: {
          course_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_resources: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_resources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          comment: string | null
          course_id: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          certificate: boolean | null
          comparison_features: Json | null
          countdown_end_date: string | null
          course_type: Database["public"]["Enums"]["course_type"] | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          duration_text: string | null
          enrollment_form_fields: Json | null
          faq: Json | null
          featured: boolean | null
          id: string
          instructor_bio: string | null
          instructor_id: string | null
          instructor_name: string | null
          instructor_photo: string | null
          instructor_title: string | null
          language: string | null
          learning_outcomes: Json | null
          module_count: number | null
          modules: Json | null
          payment_instructions: string | null
          payment_methods: Json | null
          poster_url: string | null
          early_bird_price: number | null
          early_bird_limit: number | null
          price_offer: number | null
          price_regular: number | null
          promo_video_url: string | null
          requirements: Json | null
          roadmap: Json | null
          slug: string
          start_date: string | null
          stats: Json | null
          status: Database["public"]["Enums"]["course_status"] | null
          target_audience: Json | null
          testimonials: Json | null
          title: string
          topics: Json | null
          upcoming: boolean | null
          updated_at: string | null
          value_breakdown: Json | null
          whats_included: Json | null
          why_join: Json | null
          whatsapp_group_link: string | null
        }
        Insert: {
          certificate?: boolean | null
          comparison_features?: Json | null
          countdown_end_date?: string | null
          course_type?: Database["public"]["Enums"]["course_type"] | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          duration_text?: string | null
          enrollment_form_fields?: Json | null
          faq?: Json | null
          featured?: boolean | null
          id?: string
          instructor_bio?: string | null
          instructor_id?: string | null
          instructor_name?: string | null
          instructor_photo?: string | null
          instructor_title?: string | null
          language?: string | null
          learning_outcomes?: Json | null
          module_count?: number | null
          modules?: Json | null
          payment_instructions?: string | null
          payment_methods?: Json | null
          poster_url?: string | null
          price_offer?: number | null
          price_regular?: number | null
          promo_video_url?: string | null
          requirements?: Json | null
          roadmap?: Json | null
          slug: string
          start_date?: string | null
          stats?: Json | null
          status?: Database["public"]["Enums"]["course_status"] | null
          target_audience?: Json | null
          testimonials?: Json | null
          title: string
          topics?: Json | null
          upcoming?: boolean | null
          updated_at?: string | null
          value_breakdown?: Json | null
          whats_included?: Json | null
          why_join?: Json | null
          whatsapp_group_link?: string | null
        }
        Update: {
          certificate?: boolean | null
          comparison_features?: Json | null
          countdown_end_date?: string | null
          course_type?: Database["public"]["Enums"]["course_type"] | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          duration_text?: string | null
          enrollment_form_fields?: Json | null
          faq?: Json | null
          featured?: boolean | null
          id?: string
          instructor_bio?: string | null
          instructor_id?: string | null
          instructor_name?: string | null
          instructor_photo?: string | null
          instructor_title?: string | null
          language?: string | null
          learning_outcomes?: Json | null
          module_count?: number | null
          modules?: Json | null
          payment_instructions?: string | null
          payment_methods?: Json | null
          poster_url?: string | null
          price_offer?: number | null
          price_regular?: number | null
          promo_video_url?: string | null
          requirements?: Json | null
          roadmap?: Json | null
          slug?: string
          start_date?: string | null
          stats?: Json | null
          status?: Database["public"]["Enums"]["course_status"] | null
          target_audience?: Json | null
          testimonials?: Json | null
          title?: string
          topics?: Json | null
          upcoming?: boolean | null
          updated_at?: string | null
          value_breakdown?: Json | null
          whats_included?: Json | null
          why_join?: Json | null
          whatsapp_group_link?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completion_date: string | null
          course_id: string | null
          created_at: string | null
          custom_form_data: Json | null
          enrollment_date: string | null
          id: string
          payment_method: string | null
          payment_proof_url: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          progress_percentage: number | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          custom_form_data?: Json | null
          enrollment_date?: string | null
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          progress_percentage?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          custom_form_data?: Json | null
          enrollment_date?: string | null
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          progress_percentage?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          id: string
          lesson_id: string | null
          position_seconds: number | null
          progress_percentage: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          position_seconds?: number | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          position_seconds?: number | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_preview: boolean | null
          lesson_order: number | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_preview?: boolean | null
          lesson_order?: number | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_preview?: boolean | null
          lesson_order?: number | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          course_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          end_time: string
          id: string
          instructor_id: string | null
          is_active: boolean | null
          is_recurring: boolean | null
          meeting_id: string | null
          meeting_link: string | null
          meeting_passcode: string | null
          meeting_platform: string | null
          notification_sent: boolean | null
          parent_session_id: string | null
          recording_added_at: string | null
          recording_added_by: string | null
          recording_drive_link: string | null
          recurrence_end_date: string | null
          recurrence_pattern: string | null
          reminder_1h_sent: boolean | null
          reminder_24h_sent: boolean | null
          scheduled_date: string
          session_number: number | null
          start_time: string
          status: string | null
          timezone: string
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time: string
          id?: string
          instructor_id?: string | null
          is_active?: boolean | null
          is_recurring?: boolean | null
          meeting_id?: string | null
          meeting_link?: string | null
          meeting_passcode?: string | null
          meeting_platform?: string | null
          notification_sent?: boolean | null
          parent_session_id?: string | null
          recording_added_at?: string | null
          recording_added_by?: string | null
          recording_drive_link?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          reminder_1h_sent?: boolean | null
          reminder_24h_sent?: boolean | null
          scheduled_date: string
          session_number?: number | null
          start_time: string
          status?: string | null
          timezone?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string
          id?: string
          instructor_id?: string | null
          is_active?: boolean | null
          is_recurring?: boolean | null
          meeting_id?: string | null
          meeting_link?: string | null
          meeting_passcode?: string | null
          meeting_platform?: string | null
          notification_sent?: boolean | null
          parent_session_id?: string | null
          recording_added_at?: string | null
          recording_added_by?: string | null
          recording_drive_link?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          reminder_1h_sent?: boolean | null
          reminder_24h_sent?: boolean | null
          scheduled_date?: string
          session_number?: number | null
          start_time?: string
          status?: string | null
          timezone?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_parent_session_id_fkey"
            columns: ["parent_session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_recording_added_by_fkey"
            columns: ["recording_added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          new_qa_response: boolean | null
          push_enabled: boolean | null
          recording_available: boolean | null
          reminder_15m_before: boolean | null
          reminder_1h_before: boolean | null
          reminder_24h_before: boolean | null
          session_cancelled: boolean | null
          session_created: boolean | null
          session_updated: boolean | null
          sms_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          new_qa_response?: boolean | null
          push_enabled?: boolean | null
          recording_available?: boolean | null
          reminder_15m_before?: boolean | null
          reminder_1h_before?: boolean | null
          reminder_24h_before?: boolean | null
          session_cancelled?: boolean | null
          session_created?: boolean | null
          session_updated?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          new_qa_response?: boolean | null
          push_enabled?: boolean | null
          recording_available?: boolean | null
          reminder_15m_before?: boolean | null
          reminder_1h_before?: boolean | null
          reminder_24h_before?: boolean | null
          session_cancelled?: boolean | null
          session_created?: boolean | null
          session_updated?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category: string
          challenge: string | null
          created_at: string | null
          demo_url: string | null
          description: string
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          key_outcomes: Json | null
          slug: string
          solution: string | null
          technologies: string[]
          testimonial_author: string | null
          testimonial_content: string | null
          testimonial_role: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          challenge?: string | null
          created_at?: string | null
          demo_url?: string | null
          description: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          key_outcomes?: Json | null
          slug: string
          solution?: string | null
          technologies: string[]
          testimonial_author?: string | null
          testimonial_content?: string | null
          testimonial_role?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          challenge?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          key_outcomes?: Json | null
          slug?: string
          solution?: string | null
          technologies?: string[]
          testimonial_author?: string | null
          testimonial_content?: string | null
          testimonial_role?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          linkedin_url: string | null
          portfolio_url: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          linkedin_url?: string | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          linkedin_url?: string | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      session_qa: {
        Row: {
          content: string
          created_at: string | null
          id: string
          instructor_response: string | null
          is_answered: boolean | null
          is_pinned: boolean | null
          question_type: string | null
          responded_at: string | null
          responded_by: string | null
          session_id: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          instructor_response?: string | null
          is_answered?: boolean | null
          is_pinned?: boolean | null
          question_type?: string | null
          responded_at?: string | null
          responded_by?: string | null
          session_id: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          instructor_response?: string | null
          is_answered?: boolean | null
          is_pinned?: boolean | null
          question_type?: string | null
          responded_at?: string | null
          responded_by?: string | null
          session_id?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_qa_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_qa_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_qa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      upcoming_programs: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          id: string
          image_url: string | null
          notify_list: Json | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          notify_list?: Json | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          notify_list?: Json | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "admin" | "instructor"
      contact_status: "new" | "in_progress" | "resolved" | "closed"
      course_status: "draft" | "published" | "archived"
      course_type: "live" | "recorded" | "hybrid"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      enrollment_status: "pending" | "active" | "completed" | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      program_status: "draft" | "published" | "archived"
      project_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: Exclude<keyof Database, '__InternalSupabase'> },
  TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: Exclude<keyof Database, '__InternalSupabase'> },
  TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: Exclude<keyof Database, '__InternalSupabase'> },
  TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: Exclude<keyof Database, '__InternalSupabase'> },
  EnumName extends PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: Exclude<keyof Database, '__InternalSupabase'> },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: Exclude<keyof Database, '__InternalSupabase'>
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
