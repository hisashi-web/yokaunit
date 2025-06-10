import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data.user) {
        // プロフィール情報を確認
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (!profileError && profile) {
          // プロフィールが存在し、必要な情報が揃っているかチェック
          if (!profile.username || !profile.phone_number || !profile.birth_date) {
            // 追加情報が必要な場合は追加情報入力ページにリダイレクト
            return NextResponse.redirect(new URL("/auth/additional-info", request.url))
          }
        }

        // 成功時はホームページにリダイレクト
        return NextResponse.redirect(new URL(next, request.url))
      }
    } catch (error) {
      console.error("Error exchanging code for session:", error)
    }
  }

  // エラーの場合はログインページにリダイレクト
  return NextResponse.redirect(new URL("/login", request.url))
}
