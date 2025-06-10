"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function HashHandlerPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [message, setMessage] = useState("認証情報を処理中...")
  const router = useRouter()

  useEffect(() => {
    const handleAuthHash = async () => {
      try {
        console.log("Starting hash processing...")
        console.log("Current URL:", window.location.href)
        console.log("Hash:", window.location.hash)

        // URLからハッシュを読み取ってセッションを取得
        const { data, error } = await supabase.auth.getSessionFromUrl()

        if (error) {
          console.error("Error getting session from URL:", error)
          setMessage("認証に失敗しました")
          setTimeout(() => {
            router.push("/login")
          }, 2000)
          return
        }

        if (data.session && data.user) {
          console.log("✅ Authentication successful!")
          console.log("User info:", {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
            avatar: data.user.user_metadata?.avatar_url,
          })

          setMessage("ログイン成功！リダイレクト中...")

          // ハッシュをURLから削除
          console.log("Removing hash from URL...")
          window.history.replaceState({}, document.title, window.location.pathname)

          // 少し待ってからホームページにリダイレクト
          setTimeout(() => {
            console.log("Redirecting to home...")
            router.push("/")
          }, 1000)
        } else {
          console.log("No session found in URL")
          setMessage("セッション情報が見つかりません")
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        }
      } catch (error) {
        console.error("Error processing auth hash:", error)
        setMessage("認証処理中にエラーが発生しました")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } finally {
        setIsProcessing(false)
      }
    }

    // ページ読み込み後に実行
    handleAuthHash()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8 px-4">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <h1 className="text-2xl font-bold">認証処理中</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
