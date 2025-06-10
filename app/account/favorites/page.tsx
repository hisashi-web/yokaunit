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
import { useAuth } from "@/hooks/use-auth"
import { getUserFavorites, toggleFavorite } from "@/lib/actions/favorites"
import { getTools, type Tool } from "@/lib/actions/tools"

export default function FavoritesPage() {
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([])
  const [savedPasswords, setSavedPasswords] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("tools")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    const fetchData = async () => {
      if (!isLoggedIn) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        // お気に入りツール
        const favoriteIds = await getUserFavorites()

        if (favoriteIds.length > 0) {
          const { tools } = await getTools({ slugs: favoriteIds })
          setFavoriteTools(tools)
        }

        // 保存したパスワード
        const passwords = localStorage.getItem("savedPasswords")
        if (passwords) {
          setSavedPasswords(JSON.parse(passwords))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isLoggedIn, router])

  const removeFavoriteTool = async (toolSlug: string) => {
    try {
      const result = await toggleFavorite(toolSlug)

      if (result.success) {
        setFavoriteTools(favoriteTools.filter((tool) => tool.slug !== toolSlug))

        toast({
          title: "お気に入りから削除しました",
          description: "ツールがお気に入りリストから削除されました",
        })
      }
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast({
        title: "エラー",
        description: "お気に入りの削除に失敗しました",
        variant: "destructive",
      })
    }
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

  if (loading) {
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
                    {favoriteTools.map((tool) => (
                      <Card key={tool.slug} className="relative">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
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
                                onClick={() => removeFavoriteTool(tool.slug)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                削除
                              </Button>
                              <Link href={tool.href} onClick={() => window.scrollTo(0, 0)}>
                                <Button size="sm">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  開く
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
