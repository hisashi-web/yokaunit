import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  console.log("🔄 Auth callback triggered")
  console.log("Code present:", !!code)
  console.log("Next URL:", next)

  if (code) {
    try {
      const supabase = createServerSupabaseClient()

      // PKCEフローでコードをセッションに交換
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("❌ Error exchanging code for session:", error)
        return NextResponse.redirect(`${origin}/login?error=auth_error`)
      }

      if (data.user) {
        console.log("✅ User authenticated:", data.user.email)

        // プロフィールの確認・作成
        const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

        if (!existingProfile) {
          console.log("📝 Creating new profile...")

          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            username:
              data.user.user_metadata?.name ||
              data.user.user_metadata?.full_name ||
              data.user.email?.split("@")[0] ||
              "ユーザー",
            full_name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || null,
            avatar_url: data.user.user_metadata?.avatar_url || null,
            role: "basic",
            is_active: true,
          })

          if (profileError) {
            console.error("❌ Error creating profile:", profileError)
          } else {
            console.log("✅ Profile created successfully")
          }
        } else {
          console.log("✅ Profile already exists")
        }

        // セッション情報をクッキーに設定してホームページにリダイレクト
        const response = NextResponse.redirect(`${origin}${next}`)

        // セッション情報をクッキーに保存（Supabaseが自動で行うが、明示的に設定）
        if (data.session) {
          response.cookies.set("sb-access-token", data.session.access_token, {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: data.session.expires_in,
          })

          response.cookies.set("sb-refresh-token", data.session.refresh_token, {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30日
          })
        }

        return response
      }
    } catch (error) {
      console.error("❌ Unexpected error in auth callback:", error)
    }
  }

  console.log("❌ No code provided or authentication failed")
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
