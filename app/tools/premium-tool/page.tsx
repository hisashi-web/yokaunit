"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Crown } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"

// 実際のアプリではこれはサーバーサイドの認証チェックになります
const checkUserAccess = () => {
  // ローカルストレージからログイン状態を確認（実際のアプリではセッション/トークンを使用）
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const isPremium = localStorage.getItem("isPremium") === "true"

  return { isLoggedIn, isPremium }
}

export default function PremiumToolPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    // クライアントサイドでのみ実行
    const checkAuth = () => {
      const { isLoggedIn, isPremium } = checkUserAccess()
      setIsLoggedIn(isLoggedIn)
      setIsPremium(isPremium)
      setIsLoading(false)
    }

    checkAuth()

    // ストレージの変更を監視
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>読み込み中...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-700">
                <Lock className="mr-2 h-5 w-5" />
                ログインが必要です
              </CardTitle>
              <CardDescription>このツールを利用するにはログインが必要です</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                YokaUnitアカウントにログインして、このツールにアクセスしてください。
                アカウントをお持ちでない場合は、新規登録も簡単に行えます。
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => router.push("/login")}>
                  ログイン
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => router.push("/signup")}>
                  新規登録
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!isPremium) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-700">
                <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                有料会員限定ツール
              </CardTitle>
              <CardDescription>このツールは有料会員限定のプレミアムコンテンツです</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                有料会員にアップグレードして、このツールを含む全てのプレミアムコンテンツにアクセスしましょう。
                月額わずか500円から始められます。
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600" onClick={() => router.push("/premium")}>
                  有料会員になる
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => router.push("/")}>
                  ホームに戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // 有料会員でログイン済みの場合、ツールの内容を表示
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "ツール一覧", href: "/tools" },
              { label: "高度な画像編集ツール", href: "/tools/premium-tool" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">高度な画像編集ツール</h1>
              <Badge
                className="ml-3 bg-yellow-100 text-yellow-800 flex items-center gap-1 px-2 py-1"
                title="プレミアム会員限定ツール"
              >
                <Crown className="h-3.5 w-3.5" />
              </Badge>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-6">
                  <p className="text-gray-500">ツールのインターフェース</p>
                </div>

                <h2 className="text-lg font-semibold mb-3">高度な画像編集機能</h2>
                <p className="text-sm text-gray-700 mb-4">
                  このプレミアム限定ツールでは、通常のツールでは利用できない高度な画像編集機能を使用できます。
                  背景除去、高度なフィルター、AIによる画像補正など、プロ級の編集が簡単に行えます。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">背景除去</h3>
                    <p className="text-xs text-gray-600">AIを使用して画像から背景を自動的に除去します</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">高度なフィルター</h3>
                    <p className="text-xs text-gray-600">プロ級の写真フィルターで画像を美しく仕上げます</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">AI画像補正</h3>
                    <p className="text-xs text-gray-600">AIが自動的に画像の品質を向上させます</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">バッチ処理</h3>
                    <p className="text-xs text-gray-600">複数の画像を一度に処理できます</p>
                  </div>
                </div>

                <Button className="w-full">ツールを使用する</Button>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">他のプレミアムツールも探索してみましょう</p>
              <Link href="/tools" className="text-blue-600 hover:underline text-sm">
                すべてのプレミアムツールを見る
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
