import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// クライアントサイド用のSupabaseクライアント
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ブラウザストレージにセッションを保存
    autoRefreshToken: true, // トークンの自動更新
    detectSessionInUrl: false, // 自動検出を無効化（手動で処理）
    flowType: "pkce", // PKCEフローを使用
    storage: {
      getItem: (key) => {
        if (typeof window === "undefined") return null
        return window.localStorage.getItem(key)
      },
      setItem: (key, value) => {
        if (typeof window === "undefined") return
        window.localStorage.setItem(key, value)
      },
      removeItem: (key) => {
        if (typeof window === "undefined") return
        window.localStorage.removeItem(key)
      },
    },
  },
})

// サーバーサイド用のSupabaseクライアント
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}
