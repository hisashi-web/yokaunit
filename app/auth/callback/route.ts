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
        // プロフィール情報を確認・作成
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          // プロフィールが存在しない場合は作成
          const { error: insertError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "ユーザー",
            full_name: data.user.user_metadata?.full_name || null,
            avatar_url: data.user.user_metadata?.avatar_url || null,
            role: "basic",
            is_active: true,
          })

          if (insertError) {
            console.error("Error creating profile:", insertError)
          }
        }

        // 成功時はホームページにリダイレクト（ハッシュを避ける）
        const redirectUrl = new URL("/", request.url)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error("Error exchanging code for session:", error)
    }
  }

  // エラーの場合はログインページにリダイレクト
  return NextResponse.redirect(new URL("/login", request.url))
}
