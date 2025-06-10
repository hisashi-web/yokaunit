import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  console.log("Auth callback triggered with code:", code ? "present" : "not present")

  if (code) {
    try {
      // コードをセッションに交換
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data.user) {
        console.log("User authenticated successfully:", data.user.email)

        // プロフィール情報を確認・作成
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          // プロフィールが存在しない場合は作成
          console.log("Creating new profile for user:", data.user.email)

          const { error: insertError } = await supabase.from("profiles").insert({
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

          if (insertError) {
            console.error("Error creating profile:", insertError)
          } else {
            console.log("Profile created successfully")
          }
        } else if (!profileError) {
          console.log("Profile already exists:", profile.username)
        }

        // 成功時はハッシュ処理ページにリダイレクト
        const redirectUrl = new URL("/auth/hash-handler", request.url)
        return NextResponse.redirect(redirectUrl)
      } else {
        console.error("Error exchanging code for session:", error)
      }
    } catch (error) {
      console.error("Error in auth callback:", error)
    }
  }

  // エラーの場合はログインページにリダイレクト
  return NextResponse.redirect(new URL("/login", request.url))
}
