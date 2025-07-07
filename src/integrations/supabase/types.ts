export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      disposable_email_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
        }
        Relationships: []
      }
      enterprise_sso_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean
          provider_id: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_sso_domains_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "social_auth_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_attempts: {
        Row: {
          answers: Json | null
          created_at: string
          end_time: string | null
          exam_id: string
          flagged_questions: Json | null
          id: string
          is_completed: boolean
          is_practice_mode: boolean
          passed: boolean | null
          score: number | null
          start_time: string
          time_remaining_seconds: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          created_at?: string
          end_time?: string | null
          exam_id: string
          flagged_questions?: Json | null
          id?: string
          is_completed?: boolean
          is_practice_mode?: boolean
          passed?: boolean | null
          score?: number | null
          start_time?: string
          time_remaining_seconds?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          created_at?: string
          end_time?: string | null
          exam_id?: string
          flagged_questions?: Json | null
          id?: string
          is_completed?: boolean
          is_practice_mode?: boolean
          passed?: boolean | null
          score?: number | null
          start_time?: string
          time_remaining_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_exam_attempts_exam_id"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          duration_minutes: number
          icon_url: string | null
          id: string
          image_url: string | null
          is_active: boolean
          passing_percentage: number
          title: string
          total_questions: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          passing_percentage?: number
          title: string
          total_questions?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          passing_percentage?: number
          title?: string
          total_questions?: number
          updated_at?: string
        }
        Relationships: []
      }
      question_exams: {
        Row: {
          created_at: string
          exam_id: string
          id: string
          question_id: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          id?: string
          question_id: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_exams_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_exams_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answers: Json
          created_at: string
          difficulty: string | null
          explanation: string | null
          id: string
          image_url: string | null
          options: Json
          question_text: string
          question_type: string
        }
        Insert: {
          correct_answers: Json
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          options: Json
          question_text: string
          question_type?: string
        }
        Update: {
          correct_answers?: Json
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json
          question_text?: string
          question_type?: string
        }
        Relationships: []
      }
      social_auth_providers: {
        Row: {
          client_id: string | null
          client_secret: string | null
          configuration: Json | null
          created_at: string
          id: string
          is_enabled: boolean
          provider_name: string
          provider_type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          client_secret?: string | null
          configuration?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          provider_name: string
          provider_type: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          client_secret?: string | null
          configuration?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          provider_name?: string
          provider_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_exam_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          exam_id: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          exam_id: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          exam_id?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_exam_assignments_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          admin_approved: boolean | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          full_name: string
          id: string
          is_active: boolean | null
          rejected_reason: string | null
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          admin_approved?: boolean | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          full_name: string
          id: string
          is_active?: boolean | null
          rejected_reason?: string | null
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          admin_approved?: boolean | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          rejected_reason?: string | null
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_user: {
        Args: { target_user_id: string; approving_admin_id: string }
        Returns: boolean
      }
      deactivate_user: {
        Args: { target_user_id: string; admin_id: string }
        Returns: boolean
      }
      debug_exam_attempts: {
        Args: { target_user_id?: string }
        Returns: {
          user_id: string
          exam_id: string
          is_practice_mode: boolean
          is_completed: boolean
          score: number
          passed: boolean
          start_time: string
          end_time: string
        }[]
      }
      delete_user_permanently: {
        Args: { target_user_id: string; admin_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_disposable_email: {
        Args: { email_address: string }
        Returns: boolean
      }
      reactivate_user: {
        Args: { target_user_id: string; admin_id: string }
        Returns: boolean
      }
      reject_user: {
        Args: {
          target_user_id: string
          rejecting_admin_id: string
          reason?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
