import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
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
