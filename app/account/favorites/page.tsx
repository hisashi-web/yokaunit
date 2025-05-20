"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Heart, Trash2, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  url: string
}

// ツールデータ（実際のアプリではAPIから取得）
const allTools: Record<string, Tool> = {
  pomodoro: {
    id: "pomodoro",
    name: "シンプルなポモドーロタイマー",
    description: "集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付き。",
    category: "生産性",
    url: "/tools/pomodoro",
  },
  "image-resize": {
    id: "image-resize",
    name: "画像リサイズツール",
    description: "ドラッグ&ドロップで簡単に画像サイズを変更できます。複数形式に対応。",
    category: "画像編集",
    url: "/tools/image-resize",
  },
  password: {
    id: "password",
    name: "パスワード生成ツール",
    description: "安全なパスワードを簡単に生成。強度チェック機能付き。",
    category: "セキュリティ",
    url: "/tools/password",
  },
  markdown: {
    id: "markdown",
    name: "マークダウンエディタ",
    description: "リアルタイムプレビュー付きのシンプルなマークダウンエディタ。",
    category: "テキスト",
    url: "/tools/markdown",
  },
  "pdf-to-image": {
    id: "pdf-to-image",
    name: "PDFから画像への変換",
    description: "PDFの各ページをJPG/PNG形式で保存できます。",
    category: "ファイル変換",
    url: "/tools/pdf-to-image",
  },
}

export default function FavoritesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [favoriteTools, setFavoriteTools] = useState<string[]>([])
  const [savedPasswords, setSavedPasswords] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("tools")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    // ログイン状態とお気に入りの確認
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        // お気に入りツール
        const favorites = localStorage.getItem("favorites")
        if (favorites) {
          setFavoriteTools(JSON.parse(favorites))
        }

        // 保存したパスワード
        const passwords = localStorage.getItem("savedPasswords")
        if (passwords) {
          setSavedPasswords(JSON.parse(passwords))
        }
      } else {
        // 未ログインの場合はログインページにリダイレクト
        router.push("/login")
      }
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [router])

  const removeFavoriteTool = (toolId: string) => {
    const newFavorites = favoriteTools.filter((id) => id !== toolId)
    setFavoriteTools(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    window.dispatchEvent(new Event("storage"))

    toast({
      title: "お気に入りから削除しました",
      description: "ツールがお気に入りリストから削除されました",
    })
  }

  const removePassword = (index: number) => {
    const newPasswords = [...savedPasswords]
    newPasswords.splice(index, 1)
    setSavedPasswords(newPasswords)
    localStorage.setItem("savedPasswords", JSON.stringify(newPasswords))

    toast({
      title: "パスワードを削除しました",
      description: "保存したパスワードが削除されました",
    })
  }

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password)

    toast({
      title: "コピーしました",
      description: "パスワードがクリップボードにコピーされました",
    })
  }

  if (!isLoggedIn) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "マイページ", href: "/account" },
              { label: "お気に入り", href: "/account/favorites" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">お気に入り</h1>
            <p className="text-gray-600 mb-6">お気に入りに追加したツールや保存したパスワードを管理できます。</p>

            <Tabs defaultValue="tools" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="tools" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  お気に入りツール
                </TabsTrigger>
                <TabsTrigger value="passwords" className="flex items-center gap-1">
                  <Copy className="h-4 w-4" />
                  保存したパスワード
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tools">
                {favoriteTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteTools.map((toolId) => {
                      const tool = allTools[toolId]
                      if (!tool) return null

                      return (
                        <Card key={toolId} className="relative">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                {tool.category}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => removeFavoriteTool(toolId)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  削除
                                </Button>
                                <Link href={tool.url} onClick={() => window.scrollTo(0, 0)}>
                                  <Button size="sm">
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    開く
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">お気に入りがありません</h3>
                    <p className="text-gray-600 mb-4">ツール一覧からお気に入りのツールを追加してください。</p>
                    <Link href="/tools" onClick={() => window.scrollTo(0, 0)}>
                      <Button>ツール一覧を見る</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="passwords">
                {savedPasswords.length > 0 ? (
                  <div className="space-y-4">
                    {savedPasswords.map((password, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <code className="bg-gray-100 p-2 rounded font-mono text-sm flex-1 truncate">
                              {password}
                            </code>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyPassword(password)}
                                title="クリップボードにコピー"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removePassword(index)}
                                title="削除"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Copy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">保存したパスワードがありません</h3>
                    <p className="text-gray-600 mb-4">パスワード生成ツールで作成したパスワードを保存できます。</p>
                    <Link href="/tools/password" onClick={() => window.scrollTo(0, 0)}>
                      <Button>パスワード生成ツールを使う</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
