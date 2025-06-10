export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          username: string | null
          full_name: string | null
          phone_number: string | null
          birth_date: string | null
          avatar_url: string | null
          role: "basic" | "premium" | "admin"
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          phone_number?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          role?: "basic" | "premium" | "admin"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          phone_number?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          role?: "basic" | "premium" | "admin"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          category: string
          subcategory: string | null
          tags: string[]
          icon: string
          href: string
          is_premium: boolean
          is_private: boolean
          is_new: boolean
          is_popular: boolean
          is_active: boolean
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          category: string
          subcategory?: string | null
          tags?: string[]
          icon?: string
          href: string
          is_premium?: boolean
          is_private?: boolean
          is_new?: boolean
          is_popular?: boolean
          is_active?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          category?: string
          subcategory?: string | null
          tags?: string[]
          icon?: string
          href?: string
          is_premium?: boolean
          is_private?: boolean
          is_new?: boolean
          is_popular?: boolean
          is_active?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
