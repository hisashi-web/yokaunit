"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Settings, Heart, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { CategoryIcon } from "@/components/category-icon"

interface FavoriteTool {
  id: string
  slug: string
  title: string
  description: string
  category: string
  icon: string
  href: string
  is_premium: boolean
  is_new: boolean
}

export default function FavoritesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<FavoriteTool[]>([])
  const router = useRouter()
  const { isLoggedIn, user, profile, isPremium, ensureProfileExists } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoggedIn || !user) {
        router.push("/login")
        return
      }

      // プロフィールが存在することを確認
      if (user && !profile) {
        await ensureProfileExists(user.id)
      }

      await fetchFavorites()
      setIsLoading(false)
    }

    checkAuth()
  }, [isLoggedIn, user, profile, router, ensureProfileExists])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("tools(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching favorites:", error)
        return
      }

      const favoriteTools = data.filter((item) => item.tools).map((item) => item.tools) as FavoriteTool[]

      setFavorites(favoriteTools)
    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  const removeFavorite = async (toolId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("tool_id", toolId)

      if (error) {
        console.error("Error removing favorite:", error)
        return
      }

      // いいね数を減らす
      await supabase.rpc("decrement_likes", { slug_to_update: favorites.find((f) => f.id === toolId)?.slug })

      // 再取得
      await fetchFavorites()
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p>読み込み中...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">この機能を利用するにはログインが必要です。</p>
            <Button onClick={() => router.push("/login")}>ログイン</Button>
          </div>
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
            <div className="flex flex-col md:flex-row gap-6">
              {/* サイドバー */}
              <div className="w-full md:w-64">
                <Card className="mb-4">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="h-10 w-10 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{profile?.username || "ユーザー"}</CardTitle>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                      {isPremium && (
                        <Badge className="mt-2 bg-yellow-100 text-yellow-800 flex items-center gap-1">
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
                  <Button variant="default" className="w-full justify-start" asChild>
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
                    <CardTitle>お気に入りツール</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favorites.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">お気に入りに登録したツールはありません</p>
                        <Button className="mt-4" asChild>
                          <Link href="/tools">ツール一覧を見る</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {favorites.map((tool) => (
                          <div
                            key={tool.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <CategoryIcon category={tool.category} className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  <Link href={tool.href} className="hover:text-blue-600 transition-colors">
                                    {tool.title}
                                  </Link>
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{tool.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {tool.is_new && <Badge className="bg-green-100 text-green-800">NEW</Badge>}
                              {tool.is_premium && <Badge className="bg-yellow-100 text-yellow-800">プレミアム</Badge>}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeFavorite(tool.id)}
                              >
                                <Heart className="h-5 w-5 fill-current" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
