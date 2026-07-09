export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
        };
      };
      starters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          flour_base: string;
          hydration_percent: number;
          started_at: string;
          status: string;
          storage_mode: string;
          default_feed_ratio: string;
          default_feed_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          flour_base: string;
          hydration_percent?: number;
          started_at: string;
          status?: string;
          storage_mode?: string;
          default_feed_ratio?: string;
          default_feed_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          flour_base?: string;
          hydration_percent?: number;
          started_at?: string;
          status?: string;
          storage_mode?: string;
          default_feed_ratio?: string;
          default_feed_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      feeding_logs: {
        Row: {
          id: string;
          starter_id: string;
          user_id: string;
          fed_at: string;
          starter_kept_g: number | null;
          flour_g: number | null;
          water_g: number | null;
          flour_type: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          starter_id: string;
          user_id: string;
          fed_at?: string;
          starter_kept_g?: number | null;
          flour_g?: number | null;
          water_g?: number | null;
          flour_type?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          starter_id?: string;
          user_id?: string;
          fed_at?: string;
          starter_kept_g?: number | null;
          flour_g?: number | null;
          water_g?: number | null;
          flour_type?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      timeline_events: {
        Row: {
          id: string;
          starter_id: string;
          user_id: string;
          event_type: string;
          title: string;
          event_date: string;
          recipe_id: string | null;
          recipe_url: string | null;
          comment: string | null;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          starter_id: string;
          user_id: string;
          event_type: string;
          title: string;
          event_date?: string;
          recipe_id?: string | null;
          recipe_url?: string | null;
          comment?: string | null;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          starter_id?: string;
          user_id?: string;
          event_type?: string;
          title?: string;
          event_date?: string;
          recipe_id?: string | null;
          recipe_url?: string | null;
          comment?: string | null;
          rating?: number | null;
          created_at?: string;
        };
      };
      starter_readiness_checks: {
        Row: {
          id: string;
          starter_id: string;
          user_id: string;
          checked_at: string;
          has_bubbles: boolean;
          doubles_predictably: boolean;
          pleasant_smell: boolean;
          used_successfully: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          starter_id: string;
          user_id: string;
          checked_at?: string;
          has_bubbles?: boolean;
          doubles_predictably?: boolean;
          pleasant_smell?: boolean;
          used_successfully?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          starter_id?: string;
          user_id?: string;
          checked_at?: string;
          has_bubbles?: boolean;
          doubles_predictably?: boolean;
          pleasant_smell?: boolean;
          used_successfully?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          source_url: string | null;
          ingredients: Json | null;
          steps: string | null;
          flour_type: string | null;
          hydration_percent: number | null;
          grade: number | null;
          notes: string | null;
          visibility: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          source_url?: string | null;
          ingredients?: Json | null;
          steps?: string | null;
          flour_type?: string | null;
          hydration_percent?: number | null;
          grade?: number | null;
          notes?: string | null;
          visibility?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          source_url?: string | null;
          ingredients?: Json | null;
          steps?: string | null;
          flour_type?: string | null;
          hydration_percent?: number | null;
          grade?: number | null;
          notes?: string | null;
          visibility?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notification_settings: {
        Row: {
          id: string;
          starter_id: string;
          user_id: string;
          enabled: boolean;
          reminder_time: string | null;
          timezone: string | null;
          expo_push_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          starter_id: string;
          user_id: string;
          enabled?: boolean;
          reminder_time?: string | null;
          timezone?: string | null;
          expo_push_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          starter_id?: string;
          user_id?: string;
          enabled?: boolean;
          reminder_time?: string | null;
          timezone?: string | null;
          expo_push_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
