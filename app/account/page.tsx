"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { User, Settings, Heart, Crown, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  url: string
  isNew?: boolean
  isPremium?: boolean
  isPrivate?: boolean
  likes?: number
}

// ツールデータ（実際のアプリではAPIから取得）
const allTools: Record<string, Tool> = {
  pomodoro: {
    id: "pomodoro",
    name: "シンプルなポモドーロタイマー",
    description: "集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付き。",
    category: "生産性",
    url: "/tools/pomodoro",
    isNew: true,
    likes: 87,
  },
  "image-resize": {
    id: "image-resize",
    name: "画像リサイズツール",
    description: "ドラッグ&ドロップで簡単に画像サイズを変更できます。複数形式に対応。",
    category: "画像編集",
    url: "/tools/image-resize",
    isNew: false,
    likes: 189,
  },
  password: {
    id: "password",
    name: "パスワード生成ツール",
    description: "安全なパスワードを簡単に生成。強度チェック機能付き。",
    category: "セキュリティ",
    url: "/tools/password",
    isNew: false,
    likes: 245,
  },
  markdown: {
    id: "markdown",
    name: "マークダウンエディタ",
    description: "リアルタイムプレビュー付きのシンプルなマークダウンエディタ。",
    category: "テキスト",
    url: "/tools/markdown",
    isNew: false,
    likes: 124,
  },
  "pdf-to-image": {
    id: "pdf-to-image",
    name: "PDFから画像への変換",
    description: "PDFの各ページをJPG/PNG形式で保存できます。",
    category: "ファイル変換",
    url: "/tools/pdf-to-image",
    isNew: false,
    likes: 156,
  },
  "color-palette": {
    id: "color-palette",
    name: "カラーパレット生成",
    description: "調和の取れたカラーパレットを自動生成。デザイン作業に役立ちます。",
    category: "デザイン",
    url: "/tools/color-palette",
    isNew: false,
    likes: 112,
  },
}

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    // ログイン状態の確認
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const premium = localStorage.getItem("isPremium") === "true"
        const name = localStorage.getItem("username") || ""
        const userEmail = localStorage.getItem("email") || ""
        const savedFavorites = localStorage.getItem("favorites")

        setIsPremium(premium)
        setUsername(name)
        setEmail(userEmail)

        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
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

  // お気に入りツールの取得
  const favoriteTools = favorites.map((id) => allTools[id]).filter((tool): tool is Tool => tool !== undefined)

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
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* サイドバー */}
              <div className="w-full md:w-64">
                <Card className="mb-4">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="h-10 w-10 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{username}</CardTitle>
                      <p className="text-sm text-gray-500">{email}</p>
                      {isPremium && (
                        <Badge className="mt-2 bg-yellow-100 text-yellow-800 flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          <span>プレミアム会員</span>
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account">
                      <User className="mr-2 h-4 w-4" />
                      アカウント情報
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      お気に入り
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account/history">
                      <Clock className="mr-2 h-4 w-4" />
                      利用履歴
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      設定
                    </Link>
                  </Button>
                </div>
              </div>

              {/* メインコンテンツ */}
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle>マイページ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="favorites">
                      <TabsList className="mb-4">
                        <TabsTrigger value="favorites">お気に入りツール</TabsTrigger>
                        <TabsTrigger value="account">アカウント情報</TabsTrigger>
                      </TabsList>

                      <TabsContent value="favorites">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">お気に入りツール</h3>

                          {favoriteTools.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {favoriteTools.map((tool) => (
                                <Link key={tool.id} href={tool.url} className="block">
                                  <Card className="h-full hover:shadow-md transition-shadow duration-200">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">{tool.name}</h4>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Heart className="h-3.5 w-3.5 mr-1 fill-red-500 text-red-500" />
                                          <span>{tool.likes || 0}</span>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{tool.description}</p>
                                      <Badge variant="outline">{tool.category}</Badge>
                                    </CardContent>
                                  </Card>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">お気に入りがありません</h3>
                              <p className="text-gray-600 mb-4">ツール一覧からお気に入りのツールを追加してください。</p>
                              <Button asChild>
                                <Link href="/tools">ツール一覧を見る</Link>
                              </Button>
                            </div>
                          )}

                          {favoriteTools.length > 0 && (
                            <div className="text-center mt-4">
                              <Button variant="outline" asChild>
                                <Link href="/account/favorites">すべてのお気に入りを見る</Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="account">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">アカウント情報</h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">ユーザー名</h4>
                              <p>{username}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">メールアドレス</h4>
                              <p>{email}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">会員ステータス</h4>
                              <p>{isPremium ? "プレミアム会員" : "無料会員"}</p>
                            </div>
                          </div>

                          {!isPremium && (
                            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                              <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                                <Crown className="h-4 w-4 mr-2 text-yellow-600" />
                                プレミアム会員になる
                              </h4>
                              <p className="text-sm text-yellow-700 mb-3">
                                プレミアム会員になると、すべてのツールにアクセスでき、広告も表示されません。
                              </p>
                              <Button className="bg-yellow-500 hover:bg-yellow-600" asChild>
                                <Link href="/premium">プランを見る</Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
