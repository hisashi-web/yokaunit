// components/AuthHandler.tsx
"use client"

import { Suspense } from "react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

function AuthHandlerInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      toast({
        title: "認証エラー",
        description: decodeURIComponent(error),
        variant: "destructive",
      })
      return
    }

    if (code) {
      const url = new URL(window.location.href)
      url.searchParams.delete("code")
      window.history.replaceState({}, document.title, url.toString())
      console.log("🧹 URL cleaned up - code parameter removed")
    }

    if (window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
      console.log("🧹 URL cleaned up - hash removed")
    }

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

  return null
}

// ✅ Suspenseでラップしてエクスポート
export function AuthHandler() {
  return (
    <Suspense fallback={null}>
      <AuthHandlerInner />
    </Suspense>
  )
}
