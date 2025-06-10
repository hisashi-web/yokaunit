"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronRight, Crown, Lock, Heart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getTools, type Tool } from "@/lib/actions/tools"
import { toggleFavorite, getUserFavorites } from "@/lib/actions/favorites"

export function ToolsShowcase() {
  const [activeCategory, setActiveCategory] = useState("popular")
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [displayCount, setDisplayCount] = useState(10)
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // 画面サイズに応じて表示数を調整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setDisplayCount(10)
      } else if (window.innerWidth >= 1024) {
        setDisplayCount(10)
      } else if (window.innerWidth >= 768) {
        setDisplayCount(9)
      } else if (window.innerWidth >= 640) {
        setDisplayCount(6)
      } else {
        setDisplayCount(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // ログイン状態とお気に入りの確認
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        try {
          const userFavorites = await getUserFavorites()
          setFavorites(userFavorites)
        } catch (error) {
          console.error("お気に入り取得エラー:", error)
        }
      }
    }

    checkAuth()
  }, [])

  // ツールデータを取得
  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true)
      setError(null)
      try {
        const options = {
          limit: displayCount,
          ...(activeCategory === "popular" && { isPopular: true }),
          ...(activeCategory === "new" && { isNew: true }),
        }

        const { tools: fetchedTools } = await getTools(options)
        setTools(fetchedTools)
      } catch (error) {
        console.error("Error fetching tools:", error)
        setError(error instanceof Error ? error.message : "ツールの取得に失敗しました")
        toast({
          title: "エラー",
          description: "ツールの取得に失敗しました",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTools()
  }, [activeCategory, displayCount, toast])

  const toggleFavoriteHandler = async (e: React.MouseEvent, toolSlug: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      toast({
        title: "ログインが必要です",
        description: "お気に入り機能を使用するにはログインしてください",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await toggleFavorite(toolSlug)

      if (result.success) {
        if (result.isFavorited) {
          setFavorites([...favorites, toolSlug])
          toast({
            title: "お気に入りに追加しました",
            description: "マイページのお気に入りリストから確認できます",
          })
        } else {
          setFavorites(favorites.filter((slug) => slug !== toolSlug))
          toast({
            title: "お気に入りから削除しました",
            description: "マイページのお気に入りリストから削除されました",
          })
        }
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "お気に入りの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">ツール一覧</h2>
          <Link href="/tools" className="text-sm text-blue-600 hover:underline flex items-center">
            もっと見る <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3">
          {Array.from({ length: displayCount }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">ツール一覧</h2>
          <Link href="/tools" className="text-sm text-blue-600 hover:underline flex items-center">
            もっと見る <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">データの読み込みに失敗しました</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            再読み込み
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">ツール一覧</h2>
        <Link href="/tools" className="text-sm text-blue-600 hover:underline flex items-center">
          もっと見る <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>

      <Tabs defaultValue="popular" className="w-full mb-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex min-w-max">
            <TabsTrigger value="popular" onClick={() => setActiveCategory("popular")}>
              人気のツール
            </TabsTrigger>
            <TabsTrigger value="new" onClick={() => setActiveCategory("new")}>
              新着ツール
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3"
          >
            {tools.map((tool) => (
              <motion.div key={tool.slug} variants={item}>
                <Link href={tool.href} onClick={() => window.scrollTo(0, 0)}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 hover:border-blue-200 relative bg-white/80 backdrop-blur-sm hover:translate-y-[-2px]">
                    {tool.is_premium && (
                      <div className="absolute top-0 right-0">
                        <Badge
                          className="rounded-bl-lg rounded-tr-lg bg-yellow-100 text-yellow-800 flex items-center gap-1 px-1 py-0.5"
                          title="プレミアム会員限定ツール"
                        >
                          <Crown className="h-3 w-3" />
                        </Badge>
                      </div>
                    )}
                    {tool.is_private && (
                      <div className="absolute top-0 right-0">
                        <Badge
                          className="rounded-bl-lg rounded-tr-lg bg-blue-100 text-blue-800 flex items-center gap-1 px-1 py-0.5"
                          title="限定公開ツール"
                        >
                          <Lock className="h-3 w-3" />
                        </Badge>
                      </div>
                    )}

                    <button
                      className="absolute top-1 left-1 text-gray-400 hover:text-red-500 transition-colors z-10"
                      onClick={(e) => toggleFavoriteHandler(e, tool.slug)}
                      title={favorites.includes(tool.slug) ? "お気に入りから削除" : "お気に入りに追加"}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.includes(tool.slug) ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </button>

                    <CardContent className="p-2 pt-6">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{tool.title}</h3>
                          {tool.is_new && !tool.is_premium && !tool.is_private && (
                            <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded-full">NEW</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">{tool.description}</p>
                        <div className="mt-auto flex justify-between items-center">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {tool.category}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Heart className="h-3 w-3 mr-0.5 text-red-400" />
                            {tool.likes_count || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => {
                router.push("/tools")
                window.scrollTo(0, 0)
              }}
            >
              すべてのツールを見る
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
