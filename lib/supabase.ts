import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// クライアントサイド用のSupabaseクライアント
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// サーバーサイド用のSupabaseクライアント（サーバーアクションなどで使用）
export const createServerSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
