"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function AuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // URLからcodeパラメータを確認
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    // エラーがある場合は通知
    if (error) {
      toast({
        title: "認証エラー",
        description: decodeURIComponent(error),
        variant: "destructive",
      })
      return
    }

    // codeパラメータがある場合はURLをクリーンアップ
    if (code) {
      // 現在のURLからcodeパラメータを削除
      const url = new URL(window.location.href)
      url.searchParams.delete("code")

      // 履歴を置き換えてURLをクリーンに
      window.history.replaceState({}, document.title, url.toString())

      console.log("🧹 URL cleaned up - code parameter removed")
    }

    // ハッシュがある場合も削除
    if (window.location.hash) {
      // 履歴を置き換えてハッシュを削除
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search)

      console.log("🧹 URL cleaned up - hash removed")
    }

    // セッション状態を確認
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("❌ Error checking session:", error)
        return
      }

      if (data.session) {
        console.log("✅ Session found for:", data.session.user.email)
      } else {
        console.log("ℹ️ No active session")
      }
    }

    checkSession()
  }, [searchParams, toast, router])

  return null // このコンポーネントは何もレンダリングしない
}
