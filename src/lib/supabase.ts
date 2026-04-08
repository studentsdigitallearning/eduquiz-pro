import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Public client (for client-side use with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client (bypasses RLS - for server-side admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Database types
export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          site_name: string | null
          logo_url: string | null
          favicon_url: string | null
          meta_title: string | null
          meta_description: string | null
          contact_email: string | null
          contact_phone: string | null
          whatsapp_link: string | null
          telegram_link: string | null
          rate_app_enabled: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_name?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          whatsapp_link?: string | null
          telegram_link?: string | null
          rate_app_enabled?: boolean | null
        }
        Update: {
          site_name?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          whatsapp_link?: string | null
          telegram_link?: string | null
          rate_app_enabled?: boolean | null
        }
      }
      categories: {
        Row: {
          id: string
          title: string
          description: string | null
          icon_url: string | null
          icon_type: string | null
          category_type: string
          color_code: string | null
          display_order: number
          is_active: boolean
          is_new: boolean
          created_at: string
          updated_at: string
        }
      }
      courses: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          image_url: string | null
          course_code: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      subjects: {
        Row: {
          id: string
          course_id: string
          name: string
          name_hindi: string | null
          description: string | null
          subject_code: string | null
          icon_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      sets: {
        Row: {
          id: string
          subject_id: string
          title: string
          title_hindi: string | null
          description: string | null
          total_questions: number | null
          duration_minutes: number | null
          difficulty: string | null
          is_locked: boolean
          unlock_type: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      questions: {
        Row: {
          id: string
          set_id: string
          question_text: string
          question_type: string | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          correct_answer: string
          explanation: string | null
          explanation_image_url: string | null
          difficulty: string | null
          marks: number
          negative_marks: number
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      daily_tests: {
        Row: {
          id: string
          course_id: string
          test_date: string
          language: string | null
          total_questions: number | null
          duration_minutes: number | null
          is_locked: boolean
          unlock_type: string | null
          allow_retake: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      daily_questions: {
        Row: {
          id: string
          test_id: string
          question_text: string
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          correct_answer: string
          explanation: string | null
          marks: number
          negative_marks: number
          display_order: number
          created_at: string
          updated_at: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          state: string | null
          district: string | null
          course_id: string | null
          preferred_language: string | null
          total_tests_taken: number
          total_score: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      results: {
        Row: {
          id: string
          user_id: string
          test_id: string
          test_type: string
          course_id: string | null
          total_questions: number
          correct_answers: number
          wrong_answers: number
          skipped_answers: number
          total_score: number
          percentage: number
          time_taken_seconds: number | null
          rank: number | null
          attempt_number: number
          status: string
          test_date: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
