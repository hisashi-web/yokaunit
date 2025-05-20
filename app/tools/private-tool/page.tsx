"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Key } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"

// 実際のアプリではこれはサーバーサイドの認証チェックになります
const checkUserAccess = () => {
  // ローカルストレージからログイン状態を確認（実際のアプリではセッション/トークンを使用）
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const hasAccess = localStorage.getItem("hasPrivateAccess") === "true"

  return { isLoggedIn, hasAccess }
}

export default function PrivateToolPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    // クライアントサイドでのみ実行
    const checkAuth = () => {
      const { isLoggedIn, hasAccess } = checkUserAccess()
      setIsLoggedIn(isLoggedIn)
      setHasAccess(hasAccess)
      setIsLoading(false)
    }

    checkAuth()

    // ストレージの変更を監視
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 実際のアプリではサーバーサイドでコードを検証します
    if (accessCode === "123456") {
      localStorage.setItem("hasPrivateAccess", "true")
      setHasAccess(true)

      // ストレージイベントを発火して他のコンポーネントに通知
      window.dispatchEvent(new Event("storage"))
    } else {
      setError("アクセスコードが正しくありません")
    }
  }

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

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Key className="mr-2 h-5 w-5" />
                限定公開ツール
              </CardTitle>
              <CardDescription>このツールは限定公開コンテンツです</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                このツールにアクセスするには、管理者から提供されたアクセスコードが必要です。
              </p>

              <form onSubmit={handleAccessCodeSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="access-code" className="text-sm font-medium">
                      アクセスコード
                    </label>
                    <Input
                      id="access-code"
                      placeholder="例: 123456"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      required
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="flex-1">
                      アクセス
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/")}>
                      ホームに戻る
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // アクセス権がある場合、ツールの内容を表示
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "ツール一覧", href: "/tools" },
              { label: "企業向け特別分析ツール", href: "/tools/private-tool" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">企業向け特別分析ツール</h1>
              <Badge
                className="ml-3 bg-blue-100 text-blue-800 flex items-center gap-1 px-2 py-1"
                title="限定公開ツール"
              >
                <Lock className="h-3.5 w-3.5" />
              </Badge>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-6">
                  <p className="text-gray-500">ツールのインターフェース</p>
                </div>

                <h2 className="text-lg font-semibold mb-3">企業向け特別分析機能</h2>
                <p className="text-sm text-gray-700 mb-4">
                  このツールは、お客様の特別なご要望に基づいて開発された限定公開ツールです。
                  高度なデータ分析、レポート生成、カスタムダッシュボードなどの機能を提供します。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">データ分析</h3>
                    <p className="text-xs text-gray-600">高度なアルゴリズムによるデータ分析機能</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">レポート生成</h3>
                    <p className="text-xs text-gray-600">カスタマイズ可能なPDFレポートを自動生成</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">ダッシュボード</h3>
                    <p className="text-xs text-gray-600">リアルタイムデータを視覚化するダッシュボード</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">データエクスポート</h3>
                    <p className="text-xs text-gray-600">複数形式でのデータエクスポート機能</p>
                  </div>
                </div>

                <Button className="w-full">ツールを使用する</Button>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                ご不明点やご要望がございましたら、担当者までお問い合わせください。
              </p>
              <Link href="/contact" className="text-blue-600 hover:underline text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
