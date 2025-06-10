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
import { useAuth } from "@/hooks/use-auth"
import { getUserFavorites } from "@/lib/actions/favorites"
import { getTools, type Tool } from "@/lib/actions/tools"

export default function AccountPage() {
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { isLoggedIn, profile, isPremium } = useAuth()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    const fetchFavorites = async () => {
      if (!isLoggedIn) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        const favoriteIds = await getUserFavorites()

        if (favoriteIds.length > 0) {
          const { tools } = await getTools({ slugs: favoriteIds, limit: 4 })
          setFavoriteTools(tools)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [isLoggedIn, router])

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
                      <CardTitle className="text-xl">{profile?.username || profile?.full_name || "ユーザー"}</CardTitle>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
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

                          {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
                              ))}
                            </div>
                          ) : favoriteTools.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {favoriteTools.map((tool) => (
                                <Link key={tool.slug} href={tool.href} className="block">
                                  <Card className="h-full hover:shadow-md transition-shadow duration-200">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">{tool.title}</h4>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Heart className="h-3.5 w-3.5 mr-1 fill-red-500 text-red-500" />
                                          <span>{tool.likes_count || 0}</span>
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
                              <p>{profile?.username || "未設定"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">氏名</h4>
                              <p>{profile?.full_name || "未設定"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">メールアドレス</h4>
                              <p>{profile?.email || "未設定"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">電話番号</h4>
                              <p>{profile?.phone_number || "未設定"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">生年月日</h4>
                              <p>{profile?.birth_date || "未設定"}</p>
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
